import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  BirthId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  nationalId: {
    type: String,
    required: false,
    unique: true,
    index: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    index: true,
  },

  // ✅ personal info
  dateOfBirth: {
    type: Date,
    required: true,
  },
  fatherName: {
    type: String,
    required: true,
    trim: true,
  },
  motherName: {
    type: String,
    required: true,
    trim: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female"],
  },

  // ✅ structured address
  address: {
    houseOrHoldingNo: { type: String, required: false, trim: true },
    villageOrNeighborhood: { type: String, required: false, trim: true },
    upazilaOrMunicipality: { type: String, required: false, trim: true },
    districtOrCityCorporation: { type: String, required: false, trim: true },
    unionOrZone: { type: String, required: false, trim: true },
    wardNo: { type: String, required: false, trim: true },
  },

  password: {
    type: String,
    required: [true, "Password is required"],
  },
}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

// Check password
userSchema.methods.isPasswordCorrect = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error("Password comparison failed");
  }
};


const User = mongoose.model("User", userSchema);

export { User };
export default User;