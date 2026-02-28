import Razorpay from "razorpay";
import { config } from "./env.js";

if (!config.RAZORPAY_KEY_ID || !config.RAZORPAY_SECRET) {
  throw new Error("Razorpay keys are missing in environment variables");
}

const razorpay = new Razorpay({
  key_id: config.RAZORPAY_KEY_ID,
  key_secret: config.RAZORPAY_SECRET
});

export default razorpay;