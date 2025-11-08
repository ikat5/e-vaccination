// model/staff.model.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone_number: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String },
  assigned_vaccine: {
    vaccine_name: { type: String, default: "" },
    assigned_quantity: { type: Number, default: 0 },
    remaining_quantity: { type: Number, default: 0 },
    assigned_date: { type: Date, default: 0 },
    wastage_rate: { type: Number, default: 0 },
    previous_quantity: { type: Number, default: 0 },
  },
  vaccinated_users_count: { type: Number, default: 0 },
}, { timestamps: true });

staffSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

staffSchema.methods.isPasswordCorrect = async function(password) {
  return await bcrypt.compare(password, this.password);
};


export const Staff = mongoose.model("Staff", staffSchema);
