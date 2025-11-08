import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../model/user.model.js";
import { Vaccine } from "../model/vaccine.model.js";


// 🧬 SIGNUP Controller
export const signUp = asyncHandler(async (req, res) => {
  const {
    fullName = "",
    email = "",
    password = "",
    phoneNumber = "",
    dateOfBirth = "",
    fatherName = "",
    motherName = "",
    gender = "",
    BirthId = "",
    nationalId = "",
    address = {},
  } = req.body;
  console.log(`${address}`)
  // ✅ check required fields
  if (
    [fullName, email, password, phoneNumber, dateOfBirth, fatherName, motherName, gender, BirthId]
      .some((field) => String(field).trim() === "")
  ) {
    throw new ApiError(400, "All required fields must be filled");
  }
  // ✅ check if user exists
  const existedUser = await User.findOne({ $or: [{ email }, { BirthId }] });
  if (existedUser) {
    throw new ApiError(400, "User with this email or Birth ID already exists");
  }
  // ✅ create user profile
  const user = await User.create({
    fullName,
    email,
    password,
    phoneNumber,
    dateOfBirth,
    fatherName,
    motherName,
    gender,
    BirthId,
    nationalId,
    address: {
      houseOrHoldingNo: address.houseOrHoldingNo || "",
      villageOrNeighborhood: address.villageOrNeighborhood || "",
      upazilaOrMunicipality: address.upazilaOrMunicipality || "",
      districtOrCityCorporation: address.districtOrCityCorporation || "",
      unionOrZone: address.unionOrZone || "",
      wardNo: address.wardNo || "",
    },
  });

  // ✅ check if vaccine data exists for this BirthId
  let vaccineRecord = await Vaccine.findOne({ birthId: BirthId });

  if (!vaccineRecord) {
    // If not found, create a new vaccine record
    vaccineRecord = await Vaccine.create({
      birthId: BirthId,
      vaccines: [], // initially empty, user can add later
    });
  }

  const createdUser = await User.findById(user._id).select("-password");

  return res.status(201).json(
    new ApiResponse(201, { user: createdUser, vaccineRecord }, "User registered successfully")
  );
});


export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isCorrect = await user.isPasswordCorrect(password);
  if (!isCorrect) {
    throw new ApiError(401, "Incorrect password");
  }

  const loggedInUser = await User.findById(user._id).select("-password");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser },
        "User logged in successfully"
      )
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
   return res.status(200).json(
      new ApiResponse(200, {}, "user logged out successfully")
   )
})
