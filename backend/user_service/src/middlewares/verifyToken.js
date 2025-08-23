import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
dotenv.config();

export const verifyUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized!!" });
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    const { id } = decoded;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const resUser = user.toObject();
    delete resUser.password;
    delete resUser.__v;
    delete resUser.createdAt;
    delete resUser.updatedAt;

    req.user = resUser;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Invalid Token!!" });
  }
};

export const verfiyAdmin = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized!!" });

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    const { id } = decoded;
    const user = await User.findById(id);
    const isAdmin = user.role == "admin";

    if (!isAdmin) return res.status(401).json({ message: "Access denied!!" });

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Invalid Token!!" });
  }
};
