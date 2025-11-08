import { Router } from "express";
import {
  adminSignUp,
  adminLogin,
  adminLogout,
  createStaff,
  updateVaccineStock,
  assignVaccineToStaff,
  getVaccineStock,
  getAllStaff,
} from "../controller/admin.controller.js";
import { verifyAdmin } from "../middleware/auth-middleware.js";

const router = Router();

router.post("/signup", adminSignUp);
router.post("/login", adminLogin);
router.post("/logout", verifyAdmin, adminLogout);
router.post("/create-staff", verifyAdmin, createStaff);
router.post("/update-stock", verifyAdmin, updateVaccineStock);
router.post("/assign-vaccine", verifyAdmin, assignVaccineToStaff);
router.post("/get-stock", getVaccineStock);
router.post("/get-staff", verifyAdmin, getAllStaff);

export default router;
