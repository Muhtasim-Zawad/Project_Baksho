import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config();
import { connectDB } from './config/db.js';

import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'

const app = express();
const PORT = process.env.PORT ||  8000;
//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: ['http://localhost:5173','http://localhost:5174', 'http://localhost:3000'], 
  credentials: true
}));


//db connection
connectDB();

//auth route
app.use('/api/users/auth', authRoutes)
//user route
app.use('/api/users/', userRoutes)

app.get('/', (req, res) => {
  res.send('Baksho is Running!!!');
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});