import jwt from 'jsonwebtoken'
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
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email
      }
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