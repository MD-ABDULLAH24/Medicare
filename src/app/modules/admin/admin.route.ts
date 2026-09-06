import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { adminController } from "./admin.controller";

const routers = Router();

routers.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  adminController.getAllAdmins,
);

routers.get(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  adminController.getAdminById,
);

routers.patch("/:id", checkAuth(Role.SUPER_ADMIN), adminController.updateAdmin);

routers.delete(
  "/:id",
  checkAuth(Role.SUPER_ADMIN),
  adminController.deleteAdmin,
);
