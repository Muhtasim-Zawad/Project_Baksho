import express from 'express'
import { verifyUser } from '../middlewares/verifyToken.js';
import { getUserById, updateUserProfile } from '../controllers/userControllers.js';


const router = express.Router();


router.get('/get-profile', verifyUser , async(req, res) => {
    const user = req.user;
    res.json(user);
})

router.get('/get-profile/:id',verifyUser, getUserById)
router.put('/update-profile/:id', verifyUser, updateUserProfile)



export default router;