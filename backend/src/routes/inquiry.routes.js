import express from "express";
const router = express.Router();

import { submitInquiry } from "../controllers/inquiry.controller.js";

router.post("/inquiry", submitInquiry);

export default router;
