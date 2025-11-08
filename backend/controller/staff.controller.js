import { Admin } from "../model/Admin.model.js";
import { Vaccine } from "../model/vaccine.model.js";
import { Staff } from "../model/staff.model.js";
import { User } from "../model/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcryptjs";

/* 🧩 Staff Login */
export const staffLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, "Email and password required");

  const staff = await Staff.findOne({ email });
  if (!staff) throw new ApiError(404, "Staff not found");

  const isMatch = await bcrypt.compare(password, staff.password);
  if (!isMatch) throw new ApiError(401, "Invalid credentials");

  const loggedInStaff = await Staff.findById(staff._id).select("-password");

  return res
    .status(200)
    .json(
      new ApiResponse(200, { staff: loggedInStaff }, "Staff login successful")
    );
});

/* 🚪 Staff Logout */
export const staffLogout = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Staff logged out successfully"));
});

/* 📦 Get Assigned Vaccine Info */
export const getAssignedVaccine = asyncHandler(async (req, res) => {
  const staff = await Staff.findById(req.staff._id);
  if (!staff) throw new ApiError(404, "Staff not found");

  return res.status(200).json(new ApiResponse(200, staff.assigned_vaccine, "Assigned vaccine details fetched"));
});

/* 🔁 Update Remaining Quantity (by staff or admin) */
export const updateRemainingQuantity = asyncHandler(async (req, res) => {
  const { newQuantity } = req.body;

  if (newQuantity < 0) throw new ApiError(400, "Quantity cannot be negative");

  const assignedVaccine = req.staff.assigned_vaccine;

  if (!assignedVaccine || !assignedVaccine.vaccine_name) {
    throw new ApiError(400, "No vaccine assignment found for this staff");
  }

  if (newQuantity > assignedVaccine.assigned_quantity) {
    throw new ApiError(400, "Remaining quantity cannot exceed assigned quantity");
  }

  assignedVaccine.remaining_quantity = newQuantity;
  const used = assignedVaccine.assigned_quantity - assignedVaccine.remaining_quantity;
  assignedVaccine.wastage_rate = assignedVaccine.assigned_quantity
    ? Number(((used / assignedVaccine.assigned_quantity) * 100).toFixed(2))
    : 0;

  await req.staff.save();

  return res
    .status(200)
    .json(new ApiResponse(200, req.staff.assigned_vaccine, "Vaccine quantity updated successfully"));
});

/* 💉 Administer Vaccine to User */
export const administerVaccine = asyncHandler(async (req, res) => {
  const { birthId, vaccine_name, date_taken, place, next_dose_date } = req.body;

  if (!birthId || !vaccine_name || !date_taken || !place) {
    throw new ApiError(400, "birthId, vaccine_name, date_taken, and place are required");
  }

  const staff = await Staff.findById(req.staff._id);
  if (!staff) throw new ApiError(404, "Staff not found");

  if (!staff.assigned_vaccine || !staff.assigned_vaccine.vaccine_name) {
    throw new ApiError(400, "No vaccine assignment found for this staff");
  }

  if (staff.assigned_vaccine.vaccine_name !== vaccine_name) {
    throw new ApiError(400, "Staff is not assigned to this vaccine type");
  }

  const vaccineRecord = await Vaccine.findOne({ birthId });
  if (!vaccineRecord) throw new ApiError(404, "User vaccine record not found");

  // Find vaccine or add new
  let vaccine = vaccineRecord.vaccines.find(v => v.vaccine_name === vaccine_name);
  if (!vaccine) {
    vaccineRecord.vaccines.push({
      vaccine_name,
      doses: [{ date_taken, place, next_dose_date, staffId: staff._id }],
    });
  } else {
    vaccine.doses.push({ date_taken, place, next_dose_date, staffId: staff._id });
  }

  // Decrease assigned stock
  if (staff.assigned_vaccine.remaining_quantity <= 0)
    throw new ApiError(400, "No assigned vaccines left");
  staff.assigned_vaccine.remaining_quantity -= 1;
  staff.vaccinated_users_count += 1;

  const used = staff.assigned_vaccine.assigned_quantity - staff.assigned_vaccine.remaining_quantity;
  staff.assigned_vaccine.wastage_rate = staff.assigned_vaccine.assigned_quantity
    ? Number(((used / staff.assigned_vaccine.assigned_quantity) * 100).toFixed(2))
    : 0;

  await vaccineRecord.save();
  await staff.save();

  return res.status(200).json(new ApiResponse(200, vaccineRecord, "Vaccine administered successfully"));
});

/* 📊 Get Staff Statistics (vaccinated count, wastage, etc.) */
export const getStaffStats = asyncHandler(async (req, res) => {
  const staff = await Staff.findById(req.staff._id);
  if (!staff) throw new ApiError(404, "Staff not found");

  const { assigned_vaccine, vaccinated_users_count } = staff;

  if (!assigned_vaccine || !assigned_vaccine.vaccine_name) {
    throw new ApiError(400, "No vaccine assignment found for this staff");
  }

  const totalAssigned = assigned_vaccine.previous_quantity || assigned_vaccine.assigned_quantity;
  const used = vaccinated_users_count;
  const wastage = totalAssigned
    ? ((totalAssigned - assigned_vaccine.remaining_quantity) / totalAssigned) * 100
    : 0;

  const stats = {
    vaccine_name: assigned_vaccine.vaccine_name,
    total_assigned: totalAssigned,
    remaining: assigned_vaccine.remaining_quantity,
    vaccinated_users: used,
    wastage_percentage: `${wastage.toFixed(2)}%`,
  };

  return res.status(200).json(new ApiResponse(200, stats, "Staff vaccination stats fetched successfully"));
});

/* 🔍 Get User by BirthId */
export const getUserByBirthId = asyncHandler(async (req, res) => {
  const { birthId } = req.body;
  
  if (!birthId) {
    throw new ApiError(400, "birthId is required");
  }

  const user = await User.findOne({ BirthId: birthId }).select("-password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const vaccineRecord = await Vaccine.findOne({ birthId });
  
  const userData = {
    user,
    vaccineRecord: vaccineRecord || { birthId, vaccines: [] }
  };

  return res.status(200).json(new ApiResponse(200, userData, "User data retrieved successfully"));
});
