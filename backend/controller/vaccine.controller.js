import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Vaccine } from "../model/vaccine.model.js";
import { Admin } from "../model/Admin.model.js";

// 🧩 User schedules first dose
export const scheduleFirstDose = asyncHandler(async (req, res) => {
  const { birthId, vaccine_name, date_taken, place } = req.body;

  if (!birthId || !vaccine_name || !date_taken || !place) {
    throw new ApiError(400, "birthId, vaccine_name, date_taken, and place are required");
  }

  const admin = await Admin.findOne({ "vaccine_stock.vaccine_name": vaccine_name });
  if (!admin) throw new ApiError(404, "Vaccine not available");

  const stock = admin.vaccine_stock.find(v => v.vaccine_name === vaccine_name);
  if (!stock) throw new ApiError(404, "Vaccine not available");
  if (stock.total_quantity <= 0) throw new ApiError(400, "Vaccine out of stock");

  stock.total_quantity -= 1;
  await admin.save();

  const record = await Vaccine.findOneAndUpdate(
    { birthId },
    {
      $push: {
        vaccines: {
          vaccine_name,
          doses: [{ date_taken, place }],
        },
      },
    },
    { new: true, upsert: true }
  );

  res.status(200).json(new ApiResponse(200, record, "First dose scheduled successfully"));
});

// 🧩 User schedules next dose
export const scheduleNextDose = asyncHandler(async (req, res) => {
  const { birthId, vaccine_name, next_dose_date, place } = req.body;

  if (!birthId || !vaccine_name || !next_dose_date || !place) {
    throw new ApiError(400, "birthId, vaccine_name, next_dose_date, and place are required");
  }

  const record = await Vaccine.findOne({ birthId, "vaccines.vaccine_name": vaccine_name });
  if (!record) throw new ApiError(404, "Vaccine record not found");

  const vaccine = record.vaccines.find(v => v.vaccine_name === vaccine_name);
  if (!vaccine) throw new ApiError(404, "Vaccine not found in record");

  vaccine.doses.push({ next_dose_date, place });

  await record.save();
  res.status(200).json(new ApiResponse(200, record, "Next dose scheduled successfully"));
});

// 🧩 Get user vaccine card by birthId
export const getVaccineCard = asyncHandler(async (req, res) => {
  const { birthId } = req.body;

  if (!birthId) {
    throw new ApiError(400, "birthId is required");
  }

  const record = await Vaccine.findOne({ birthId });
  
  if (!record) {
    // Return empty card if no record exists
    return res.status(200).json(
      new ApiResponse(200, { birthId, vaccines: [] }, "Vaccine card retrieved (empty)")
    );
  }

  res.status(200).json(new ApiResponse(200, record, "Vaccine card retrieved successfully"));
});