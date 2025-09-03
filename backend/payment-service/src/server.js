import express from "express";
import mysql from "mysql2";
import dotenv from "dotenv";
import Stripe from "stripe";
import cors from "cors";
import eurekaClient from "../eureka-config.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 1234;

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

// app.use(
//   cors({
//     origin: "*",
//   }),
// );
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("✅ Connected to MySQL database!");

  const createPaymentsTable = `
        CREATE TABLE IF NOT EXISTS payments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
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

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",
    payment_method_types: ["card"],
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.post("/payments", async (req, res) => {
  const paymentInfo = req.body;
  const { campaignId, userId, amount, currency, paymentIntentId, status } =
    paymentInfo;
  console.log(paymentInfo);

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
          paymentId: result.insertId,
        });
      },
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/payments", (req, res) => {
  const query = "SELECT * FROM payments ORDER BY created_at DESC";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching payments:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

app.get("/payments/user/:userId", (req, res) => {
  const { userId } = req.params;
  const query =
    "SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC";
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching user payments:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

app.get("/payments/campaign/:campaignId", (req, res) => {
  const { campaignId } = req.params;
  const query =
    "SELECT * FROM payments WHERE campaign_id = ? ORDER BY created_at DESC";
  db.query(query, [campaignId], (err, results) => {
    if (err) {
      console.error("Error fetching campaign payments:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

app.get("/", (req, res) => {
  res.send("Payment Service is running...");
});

app.listen(PORT, () => {
  console.log(`Payment service is running on port ${PORT}`);
  eurekaClient.start((error) => {
    console.log("Eureka client started with error:", error);
    if (error) {
      console.log(error);
    } else {
      console.log("Eureka registration for Payment Service complete");
    }
  });
});

function exitHandler(options, exitCode) {
  if (options.cleanup) {
    eurekaClient.stop((err) => {
      if (err) {
        console.error("Error deregistering from Eureka:", err);
      } else {
        console.log("Deregistered from Eureka");
      }
      process.exit();
    });
  }
  if (exitCode || exitCode === 0) console.log(exitCode);
  if (options.exit) process.exit();
}

process.on("exit", exitHandler.bind(null, { cleanup: true }));
process.on("SIGINT", exitHandler.bind(null, { exit: true }));
process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));
process.on("uncaughtException", exitHandler.bind(null, { exit: true }));
