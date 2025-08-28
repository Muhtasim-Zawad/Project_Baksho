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
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err);
        return;
    }
    console.log("✅ Connected to MySQL database!");

    // Create payments table if it doesn't exist
    const createPaymentsTable = `
        CREATE TABLE IF NOT EXISTS payments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            campaign_id INT NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            currency VARCHAR(10) NOT NULL,
            payment_status VARCHAR(50) NOT NULL,
            payment_intent_id VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    db.query(createPaymentsTable, (err, result) => {
        if (err) {
            console.error("Error creating payments table:", err);
        } else {
            console.log("✅ Payments table is ready!");
        }
    });
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
    const { campaignId, userId, amount, currency, paymentIntentId, status } = paymentInfo;

    if (!campaignId || !userId || !amount || !currency || !status) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const insertQuery = `
            INSERT INTO payments (user_id, campaign_id, amount, currency, payment_status, payment_intent_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        db.query(
            insertQuery,
            [userId, campaignId, amount, currency, status, paymentIntentId],
            (err, result) => {
                if (err) {
                    console.error("Error inserting payment:", err);
                    return res.status(500).json({ error: err.message });
                }

                res.json({
                    message: "Payment recorded successfully",
                    paymentId: result.insertId
                });
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }

});



app.get('/', (req, res) => {
    res.send('Payment Service is running...')
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
