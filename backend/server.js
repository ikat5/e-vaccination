import express from "express";
import dotenv from "dotenv";
import connectToMongodb from "./db/connectToMongodb.js";
import { Vaccine } from "./model/vaccine.model.js";
import { vaccineData } from "./utils/vaccineData.js";
import cors from "cors"
import cookieParser from 'cookie-parser'


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const seedDatabase = async () => {
  try {
    const count = await Vaccine.countDocuments();
    if (count === 0) {
      await Vaccine.insertMany(vaccineData);
      console.log("✅ Database has been seeded with initial vaccine data.");
    } else {
      console.log("Database already contains data, no seeding needed.");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};


// CORS configuration
const corsOptions = {
  origin: ['http://localhost:5173','http://localhost:5174', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json({limit:"16KB"}));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("E-Vaccination Backend Server is Running");
});

// Test endpoint for frontend connection
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend is connected and working!",
    timestamp: new Date().toISOString(),
  });
});

import userRouter from "./router/user.router.js";
import vaccineRouter from "./router/vaccine.router.js";
import adminRouter from "./router/admin.router.js";
import staffRouter from "./router/staff.router.js";

app.use("/api/user", userRouter);
 app.use("/api/vaccine", vaccineRouter);
 app.use("/api/admin", adminRouter);
 app.use("/api/staff", staffRouter);





app.listen(PORT, () => {
    connectToMongodb()
    seedDatabase();
  console.log(`✅ Server is running on port ${PORT}`);
});
