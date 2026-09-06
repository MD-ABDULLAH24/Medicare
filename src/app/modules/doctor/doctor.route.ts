import { Router } from "express";
import { doctorController } from "./doctor.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const routers = Router();

routers.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  doctorController.getAllDoctors,
);

routers.get(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  doctorController.getDoctorById,
);

routers.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  doctorController.updateDoctor,
);

routers.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  doctorController.deleteDoctor,
);

export const doctorRoutes = routers;
