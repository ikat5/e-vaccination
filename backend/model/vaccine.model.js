// model/vaccine.model.js
import mongoose from "mongoose";

const doseSchema = new mongoose.Schema({
  date_taken: { type: Date },
  place: { type: String },
  next_dose_date: { type: Date },
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
});

const vaccineSchema = new mongoose.Schema({
  birthId: { type: String, required: true, unique: true, index: true },
  vaccines: [
    {
      vaccine_name: { type: String, required: true },
      doses: [doseSchema],
    },
  ],
});

export const Vaccine = mongoose.model("Vaccine", vaccineSchema);
