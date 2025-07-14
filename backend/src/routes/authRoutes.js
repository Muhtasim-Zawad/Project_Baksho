import express from 'express'
import { generateNewAccessToken, loginUser, registerUser,} from '../controllers/authControllers.js';

const router = express.Router();

router.post('/signup', registerUser);
router.post("/login", loginUser);
router.post('/refresh', generateNewAccessToken);
router.post('/forgot-password', async(req, res) =>{
    console.log('Work for forget password')
});
router.post('/reset-password', async(req, res) => {
    console.log('Work for reset password')
});

export default router