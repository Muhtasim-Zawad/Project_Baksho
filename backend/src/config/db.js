import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config();

export const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        const conn = await mongoose.connect(uri);
        console.log('Db connected!!');
    } catch (error) {
        console.log(`error: ${error.message}`)
    }
}

