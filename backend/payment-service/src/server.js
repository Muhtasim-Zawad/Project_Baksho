import express from 'express'
import mysql from 'mysql2'
import dotenv from 'dotenv'
import stripe from 'stripe'

dotenv.config();

const app = express()
const PORT = process.env.PORT || 1234

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
})

db.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err);
        return;
    }
    console.log("✅ Connected to MySQL database!");
});


app.post("/create-payment-intent", async (req, res) => {
    const { price } = req.body;
    const amount = parseInt(price * 100);

    const paymentIntent = await stripe(process.env.STRIPE_SECRET_KEY).paymentIntents.create({
        amount: amount,
        currency: "usd",
        payment_method_types: ["card"], //important ----
    });

    res.send({
        clientSecret: paymentIntent.client_secret,
    });
});

app.post("/payments", async (req, res) => {
    const paymentInfo = req.body;
    console.log(paymentInfo);
    // const query = { _id: new ObjectId(paymentInfo.classId) };
    // const updateDoc = {
    //     $inc: {
    //         enroll: 1,
    //     },
    // };
    // await classCollection.updateOne(query, updateDoc);

    // const result = await paymentCollection.insertOne(paymentInfo);
    // res.send(result);
});


app.get('/', (req, res) => {
    res.send('Payment Service is running...')
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
