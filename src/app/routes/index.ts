import { Router } from "express";
import { SpecialtyRoute } from "../modules/specialty/specialty.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";
import { doctorRoutes } from "../modules/doctor/doctor.route";

const router = Router();

router.use("/auth", AuthRoutes);

router.use("/specialties", SpecialtyRoute);

router.use("/users", UserRoutes);

router.use("/doctors", doctorRoutes);

export const IndexRoutes = router;
