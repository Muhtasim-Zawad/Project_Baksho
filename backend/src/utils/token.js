import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();

export const generateAccessToken = (user) => {
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' })
}

export const generateRefreshToken = (user) => {
    return jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '7d'})
}