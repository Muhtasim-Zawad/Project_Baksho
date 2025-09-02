import express from "express";
import {
  generateNewAccessToken,
  loginUser,
  registerUser,
} from "../controllers/authControllers.js";
import { verifyUser } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/refresh", generateNewAccessToken);

export default router;
