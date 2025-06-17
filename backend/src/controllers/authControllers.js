import User from "../models/User.js";

export const registerUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userExists = await User.findOne({ email })
        if (userExists) return res.status(400).json({ message: "User already exists!" });

        const newUser = await User.create({ email, password });
        res.status(201).json({ message: 'Registered successfully' });

    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}


export const loginUser = async (req, res) => {
    const {email, password} = req.body;
    
}