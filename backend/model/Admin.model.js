// model/admin.model.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone_number: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  staff_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Staff" }],
  vaccine_stock: [
    {
      vaccine_name: { type: String, required: true },
      total_quantity: { type: Number, default: 0 },
    },
  ],
}, { timestamps: true });

// ✅ Hash password before save
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ✅ Password check
adminSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};


export const Admin = mongoose.model("Admin", adminSchema);
