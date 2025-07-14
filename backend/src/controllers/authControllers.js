import jwt from 'jsonwebtoken'
import User from "../models/User.js";
import { generateAccessToken, generateRefreshToken } from '../utils/token.js';


export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email })
    if (userExists) return res.status(400).json({ message: "User already exists!" });

    const newUser = await User.create({ name, email, password, role });

    const resUser = newUser.toObject();
    delete resUser.password;
    delete resUser.__v;
    delete resUser.createdAt;
    delete resUser.updatedAt;


    const accessToken = await generateAccessToken(newUser);
    const refreshToken = await generateRefreshToken(newUser);

    res.status(201).json({
      accessToken,
      refreshToken,
      user: resUser,
      message: 'Registered successfully'
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}


export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    await User.updateOne({ _id: user._id }, { $set: { lastLogin: new Date() } })

    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    const resUser = user.toObject();
    delete resUser.password;
    delete resUser.__v;
    delete resUser.createdAt;
    delete resUser.updatedAt;

    res.json({
      accessToken,
      refreshToken,
      user: resUser,
      message: "Login Success!!"
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}


export const generateNewAccessToken = (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid refresh token' });

    const newAccessToken = generateAccessToken({ _id: decoded.id });

    res.json({ accessToken: newAccessToken });
  });
}