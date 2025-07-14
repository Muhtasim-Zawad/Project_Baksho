import express from 'express'
import { generateNewAccessToken, loginUser, registerUser } from '../controllers/authControllers.js';

const router = express.Router();

router.post('/register', registerUser);
router.post("/login", loginUser);
router.post('/refresh', generateNewAccessToken);

export default router