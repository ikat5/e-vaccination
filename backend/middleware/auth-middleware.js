import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../model/user.model.js";
import { Admin } from "../model/Admin.model.js";
import { Staff } from "../model/staff.model.js";
import { ApiError } from "../utils/ApiError.js";

// ✅ Verify User - Get user from request body, params, or query
export const verifyUser = asyncHandler(async (req, res, next) => {
  const userId = (req.body && req.body.userId) || req.params.userId || req.query.userId || (req.body && req.body._id) || req.params._id || req.query._id;
  
  if (!userId) {
    throw new ApiError(400, "User ID is required. Please provide userId in request body, params, or query");
  }

  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  req.user = user;
  next();
});

// ✅ Verify Admin - Get admin from request body, params, or query
export const verifyAdmin = asyncHandler(async (req, res, next) => {
  const adminId = (req.body && req.body.adminId) || req.params.adminId || req.query.adminId || (req.body && req.body._id) || req.params._id || req.query._id;
  
  if (!adminId) {
    throw new ApiError(400, "Admin ID is required. Please provide adminId in request body, params, or query");
  }

  const admin = await Admin.findById(adminId).select("-password");
  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  req.admin = admin;
  next();
});

// ✅ Verify Staff - Get staff from request body, params, or query
export const verifyStaff = asyncHandler(async (req, res, next) => {
  const staffId = (req.body && req.body.staffId) || req.params.staffId || req.query.staffId || (req.body && req.body._id) || req.params._id || req.query._id;
  
  if (!staffId) {
    throw new ApiError(400, "Staff ID is required. Please provide staffId in request body, params, or query");
  }

  const staff = await Staff.findById(staffId).select("-password");
  if (!staff) {
    throw new ApiError(404, "Staff not found");
  }

  req.staff = staff;
  next();
});