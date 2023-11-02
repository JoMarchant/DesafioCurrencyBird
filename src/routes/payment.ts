import { Router } from "express";
import { sendGeneralPayment, getPaymentInfo } from "../controllers/payment";
import { authGeneralPayment } from "../middleware/auth";
import { findOrCreateUser } from "../middleware/models";
import GeneralPaymentMW from "../middleware/GeneralPayment";
const router: Router = Router();

router.post(
  "/generalPayment",
  [authGeneralPayment, findOrCreateUser, GeneralPaymentMW.checkIfPaymentExists],
  sendGeneralPayment,
);
router.get("/generalPayment", authGeneralPayment, getPaymentInfo);

export default router;
