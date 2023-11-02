import express, { Application } from "express";
import dotenv from "dotenv";

import paymentRoutes from "./routes/payment";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/payment", paymentRoutes);

app.listen(PORT, () => {
  console.log(`Express server is listening at ${PORT}`);
});
