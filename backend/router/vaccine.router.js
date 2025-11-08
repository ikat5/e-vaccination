import { Router } from "express";
import { scheduleFirstDose, scheduleNextDose, getVaccineCard } from "../controller/vaccine.controller.js";
import { verifyUser } from "../middleware/auth-middleware.js";

const router = Router();

router.post("/first-dose", verifyUser, scheduleFirstDose);
router.post("/next-dose", verifyUser, scheduleNextDose);
router.post("/card", verifyUser, getVaccineCard);

export default router;
