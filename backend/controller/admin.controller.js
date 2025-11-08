import { Admin } from "../model/Admin.model.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import { Staff } from "../model/staff.model.js";

// 🧩 Admin Signup
export const adminSignUp = asyncHandler(async (req, res) => {
  const { name, email, phone_number, password } = req.body;
  if (!name || !email || !phone_number || !password) {
    throw new ApiError(400, "All fields are required");
  }
  const exists = await Admin.findOne({ $or: [{ email }, { phone_number }] });
  if (exists) throw new ApiError(400, "Admin already exists");

  const admin = await Admin.create({ name, email, phone_number, password });
  return res.status(201).json(new ApiResponse(201, { admin }, "Admin registered successfully"));
});

// 🧩 Admin Login
export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) throw new ApiError(404, "Admin not found");
  const isCorrect = await admin.isPasswordCorrect(password);
  if (!isCorrect) throw new ApiError(401, "Invalid password");

  return res.status(200).json(new ApiResponse(200, { admin }, "Admin logged in"));
});

// 🧩 Admin Logout
export const adminLogout = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, {}, "Admin logged out successfully"));
});

// export const adminLogout = asyncHandler(async (req, res) => {
//    await Admin.findByIdAndUpdate(
//       req.admin._id, {
//       $set: {
//          refreshToken: undefined
//       }
//    },
//       {
//          new: true
//       }
//    )
//    const option = {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production'
//    }
//    return res.status(200).clearCookie("accessToken", option).clearCookie("refreshToken", option).json(
//       new ApiResponse(200, {}, "user logged out successfully")
//    )
// })



// 🧩 Create Staff
export const createStaff = asyncHandler(async (req, res) => {
  const { name, phone_number, email, password, address } = req.body;
  const staff = await Staff.create({ name, phone_number, email, password, address });
  await Admin.findByIdAndUpdate(req.admin._id, { $push: { staff_ids: staff._id } });
  res.status(201).json(new ApiResponse(201, staff, "Staff created successfully"));
});

// 🧩 Add or Update Vaccine Stock
export const updateVaccineStock = asyncHandler(async (req, res) => {
  const { vaccine_name, quantity } = req.body;
  const admin = await Admin.findById(req.admin._id);
  const existing = admin.vaccine_stock.find(v => v.vaccine_name === vaccine_name);

  if (existing) existing.total_quantity += quantity;
  else admin.vaccine_stock.push({ vaccine_name, total_quantity: quantity });

  await admin.save();
  res.status(200).json(new ApiResponse(200, admin.vaccine_stock, "Vaccine stock updated successfully"));
});

// 🧩 Assign Vaccine to Staff + calculate wastage
export const assignVaccineToStaff = asyncHandler(async (req, res) => {
  const { staffId, vaccine_name, quantity,time } = req.body;
  const staff = await Staff.findById(staffId);
  if (!staff) throw new ApiError(404, "Staff not found");

  // Calculate wastage
  if (staff.assigned_vaccine && staff.assigned_vaccine.assigned_quantity > 0) {
    const used = staff.assigned_vaccine.assigned_quantity - staff.assigned_vaccine.remaining_quantity;
    const wastage = staff.assigned_vaccine.assigned_quantity
      ? Number(((used / staff.assigned_vaccine.assigned_quantity) * 100).toFixed(2))
      : 0;
    staff.assigned_vaccine.wastage_rate = wastage;
    staff.assigned_vaccine.previous_quantity = staff.assigned_vaccine.assigned_quantity;
    staff.assigned_vaccine.assigned_date = time || Date.now();
  }

  if (!staff.assigned_vaccine) {
    staff.assigned_vaccine = {};
  }

  staff.assigned_vaccine.vaccine_name = vaccine_name;
  staff.assigned_vaccine.assigned_quantity = quantity;
  staff.assigned_vaccine.remaining_quantity = quantity;
  staff.assigned_vaccine.previous_quantity = quantity;
  staff.assigned_vaccine.wastage_rate = 0;
  staff.vaccinated_users_count = 0;
  await staff.save();
  res.status(200).json(new ApiResponse(200, staff, "Vaccine assigned successfully"));
});

export const getVaccineStock = asyncHandler(async (req, res) => {
  // Find the first admin account to get the stock from
  const admin = await Admin.findOne(); // <-- This finds any admin
  if (!admin) throw new ApiError(404, "No admin account found to pull stock from");
  
  // Make sure 'vaccine_stock' is the correct name from your schema
  res.status(200).json(new ApiResponse(200, { stock: admin.vaccine_stock }, "Vaccine stock retrieved successfully"));
});

// 🧩 Get All Staff
export const getAllStaff = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin._id);
  if (!admin) throw new ApiError(404, "Admin not found");
  
  const staffList = await Staff.find({ _id: { $in: admin.staff_ids } }).select("-password");
  res.status(200).json(new ApiResponse(200, staffList, "Staff list retrieved successfully"));
});