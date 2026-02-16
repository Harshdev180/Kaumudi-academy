// import Razorpay from "razorpay";
// import { config } from "./env.js";

// const razorpay = new Razorpay({
//   key_id: config.RAZORPAY_KEY_ID,
//   key_secret: config.RAZORPAY_SECRET
// });

// export default razorpay;
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: "rzp_test_Rn3xa74qiaEekq", // Aapki ID
  key_secret: "IY8246BCuVFDFmVBjicQhAd3", // Aapka Secret (Dhyan se paste karein)
});

export default razorpay;