import app from "./app.js"
import dotenv from "dotenv"
import connectDB from "./configs/db.js"
import {config} from "./configs/env.js"


connectDB()
const PORT = config.PORT || 5000

app.listen(PORT,()=>{
  console.log(`server is running on http://localhost:${PORT}`)
})