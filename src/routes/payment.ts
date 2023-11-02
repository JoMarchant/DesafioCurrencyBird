import { Router } from "express";
import { sendGeneralPayment, getPaymentInfo } from "../controllers/payment";
import { authGeneralPayment } from "../middleware/auth";
import { findOrCreateUser, checkIfPaymentExists } from "../middleware/models";
const router: Router = Router();

router.post(
  "/generalPayment",
  [authGeneralPayment, findOrCreateUser, checkIfPaymentExists],
  sendGeneralPayment,
);
router.get("/generalPayment", authGeneralPayment, getPaymentInfo);

export default router;
