import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import midtransClient from "midtrans-client";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API: Get Midtrans Snap Token
  app.post("/api/payment/token", async (req, res) => {
    const { orderId, grossAmount, items, customerDetails } = req.body;
    
    if (process.env.VITE_PAYMENT_MODE !== "live") {
      return res.status(400).json({ error: "Payment mode is not live" });
    }

    try {
      let snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: process.env.MIDTRANS_SERVER_KEY || "",
        clientKey: process.env.VITE_MIDTRANS_CLIENT_KEY || ""
      });

      const transaction = await snap.createTransaction({
        transaction_details: { order_id: orderId, gross_amount: grossAmount },
        item_details: items,
        customer_details: customerDetails
      });
      res.json({ token: transaction.token });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate payment token" });
    }
  });

  // Serve Frontend
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
}

startServer();