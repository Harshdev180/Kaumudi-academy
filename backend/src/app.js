import express from "express"
import {errorMiddleware} from "./middlewares/error.middleware.js" 
import authRoutes from "./routes/auth.routes.js";
import courseRoutes from "./routes/course.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import couponRoutes from "./routes/coupon.routes.js";
import inquiryRoutes from "./routes/inquiry.routes.js";
import enrollmentRoutes from "./routes/enrollment.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
const app = express()

import cors from "cors"


app.use(cors())
app.use(express.json())
app.use("/api", authRoutes);
app.use("/api", courseRoutes);
app.use("/api", paymentRoutes)
app.use("/api", couponRoutes);
app.use("/api", inquiryRoutes);
app.use("/api", enrollmentRoutes);
app.use("/api", dashboardRoutes);
app.use("/health",(_,res)=>{
  res.status(200).json({
    success:true,
    status:"OK"
  })
})

app.use(errorMiddleware)
export default app