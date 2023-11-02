import { Router } from "express";
import { sendGeneralPayment, getPaymentInfo } from "../controllers/payment";
import { authGeneralPayment } from "../middleware/auth";
const router: Router = Router();

router.post("/generalPayment", authGeneralPayment, sendGeneralPayment);
router.get("/generalPayment", authGeneralPayment, getPaymentInfo);

export default router;
