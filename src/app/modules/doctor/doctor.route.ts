import { Router } from "express";
import { doctorController } from "./doctor.controller";

const routers = Router();


routers.get("/",doctorController.getAllDoctors);


export const doctorRoutes = routers