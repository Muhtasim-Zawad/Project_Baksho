import express from 'express'
import { verifyUser } from '../middlewares/verifyToken.js';

const router = express.Router();


router.get('/get-profile', verifyUser , async(req, res) => {
    const user = req.user;
    res.json(user);
})



export default router;