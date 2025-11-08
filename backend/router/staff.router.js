// routes/staff.router.js
import { Router } from "express";
import {
  staffLogin,
  staffLogout,
  getAssignedVaccine,
  updateRemainingQuantity,
  administerVaccine,
  getStaffStats,
  getUserByBirthId
} from "../controller/staff.controller.js";
import { verifyStaff } from "../middleware/auth-middleware.js";

const router = Router();

// Public
router.post("/login", staffLogin);

// Protected (staff token required)
router.post("/logout", verifyStaff, staffLogout);
router.get("/assigned", verifyStaff, getAssignedVaccine);               // get assigned vaccine & remaining qty
router.patch("/update-quantity", verifyStaff, updateRemainingQuantity); // staff updates remaining qty (or admin updates)
router.post("/administer", verifyStaff, administerVaccine);             // record a vaccine dose for a user (birthId)
router.get("/stats", verifyStaff, getStaffStats);                       // get number of vaccinated users & wastage
router.post("/get-user", verifyStaff, getUserByBirthId);               // get user by birthId

export default router;
