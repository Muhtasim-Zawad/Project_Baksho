import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js';


import authRoutes from './routes/authRoutes.js'


//db connection
connectDB();

dotenv.config();

const app = express();
const PORT = process.env.PORT ||  8000;

//routes
app.use('/api/auth', authRoutes)


app.get('/', (req, res) => {
  res.send('Baksho is Running!!!');
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});