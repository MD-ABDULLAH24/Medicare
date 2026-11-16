import { NextFunction, Request, Response } from "express";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { cookieUtils } from "../utils/cookie";
import { prisma } from "../lib/prisma";
import AppError from "../errorHelpers/AppError";
import status from "http-status";
import { jwtUtils } from "../utils/jwt";
import { envVars } from "../config/env";

export const checkAuth =
  (...authRoles: Role[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //? Get session token from request cookie
      const sessionToken = cookieUtils.getCookie(
        req,
        "better-auth.session_token",
      );

      //? Reject request if no session token is provided

      if (!sessionToken) {
        throw new Error("Unauthorized access! No session token provided.");
      }

      //? Find a valid and non-expired session from database

      if (sessionToken) {
        const sessionExists = await prisma.session.findFirst({
          where: {
            token: sessionToken,
            expiresAt: {
              //? Only allow sessions that have not expired yet
              gt: new Date(),
            },
          },
          include: {
            //? Include user information associated with this session
            user: true,
          },
        });

        //? Continue authentication process if session and user exist

        if (sessionExists && sessionExists.user) {
          const user = sessionExists.user;

          /**
           * Calculate remaining session time
           * and determine whether the session is close to expiry
           */

          const now = new Date();

          const expiresAt = new Date(sessionExists.expiresAt);

          const createdAt = new Date(sessionExists.createdAt);

          const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();

          const timeRemaining = expiresAt.getTime() - now.getTime();

          const percentRemaining = (timeRemaining / sessionLifeTime) * 100;

          //? Notify client when less than 20% of session time remains

          if (percentRemaining < 20) {
            res.setHeader("X-Session-Refresh", "true");
            res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
            res.setHeader("X-Time-Remaining", timeRemaining.toString());
          }

          //? Prevent blocked or deleted users from accessing resources

          if (user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED) {
            throw new AppError(
              status.UNAUTHORIZED,
              "Unauthorized access! User is not active.",
            );
          }

          //? Prevent soft-deleted users from accessing resources

          if (user.isDeleted) {
            throw new AppError(
              status.UNAUTHORIZED,
              "Unauthorized access! User is deleted.",
            );
          }
          //? Check whether the user has one of the required roles

          if (authRoles.length > 0 && !authRoles.includes(user.role)) {
            throw new AppError(
              status.FORBIDDEN,
              "Forbidden access! You do not have permission to access this resource",
            );
          }
          req.user = {
            userId: user.id,
            role: user.role,
            email: user.email
          }
        }

        const accessToken = cookieUtils.getCookie(req, "accessToken");

        if (!accessToken) {
          throw new AppError(
            status.UNAUTHORIZED,
            "Unauthorized access! No access token provided",
          );
        }
      }

      const accessToken = cookieUtils.getCookie(req, "accessToken");

      if (!accessToken) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized access! No access token provided.",
        );
      }
      const verifiedToken = jwtUtils.verifyToken(
        accessToken,
        envVars.ACCESS_TOKEN_SECRET,
      );

      if (!verifiedToken.success) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized access! Invalid access token",
        );
      }

      if (
        authRoles.length > 0 &&
        !authRoles.includes(verifiedToken.data!.role as Role)
      ) {
        throw new AppError(
          status.FORBIDDEN,
          "Forbidden access! You do not have permission to access this resource.",
        );
      }
      

      next();
    } catch (error: any) {
      //? Pass any error to the global error handler
      next(error);
    }
  };
