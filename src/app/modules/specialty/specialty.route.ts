import { Router } from "express";

import { SpecialtyController } from "./specialty.controller";

import { checkAuth } from "../../middleware/checkAuth";

import { Role } from "../../../generated/prisma/enums";

const router = Router();

// Create a new specialty (Admin & Super Admin only)
router.post(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  SpecialtyController.createSpecialty,
);

// Get all specialties
router.get("/", SpecialtyController.getAllSpecialty);

// Update a specialty by ID
router.patch("/:id", SpecialtyController.updateSpecialty);

// Delete a specialty by ID (Admin & Super Admin only)
router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  SpecialtyController.deleteSpecialty,
);

export const SpecialtyRoute = router;
