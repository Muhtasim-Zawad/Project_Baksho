import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import eurekaClient from "../eureka-config.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.get("/info", (req, res) => {
  res.json({ status: "UP" });
});

app.get("/health", (req, res) => {
  res.json({ status: "UP" });
});

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
    ],
    credentials: true,
  }),
);

//db connection
connectDB();

//auth route
app.use("/api/users/auth", authRoutes);
//user route
app.use("/api/users/", userRoutes);

app.get("/", (req, res) => {
  res.send("Baksho is Running!!!");
});

app.listen(PORT, () => {
  console.log(`User service is running on port ${PORT}`);
  eurekaClient.start((error) => {
    if (error) {
      console.log(error);
      console.log("Eureka registration failed:", error);
    } else {
      console.log("Eureka registration complete");
    }
  });
});

// Graceful shutdown

function exitHandler(options, exitCode) {
  if (options.cleanup) {
    eurekaClient.stop((err) => {
      if (err) {
        console.error("Error deregistering from Eureka:", err);
      } else {
        console.log("Deregistered from Eureka");
      }
      process.exit();
    });
  }
  if (exitCode || exitCode === 0) console.log(exitCode);
  if (options.exit) process.exit();
}

// Do something when app is closing
process.on("exit", exitHandler.bind(null, { cleanup: true }));

// Catches ctrl+c event
process.on("SIGINT", exitHandler.bind(null, { exit: true }));

// Catches "kill pid" (for example: nodemon restart)
process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));

// Catches uncaught exceptions
process.on("uncaughtException", exitHandler.bind(null, { exit: true }));
