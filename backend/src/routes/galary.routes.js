import express from "express";
import { createGallery, getAllGallery, deleteGallery } from "../controllers/galary.controller.js"
import { upload } from "../middlewares/upload.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, roleMiddleware("ADMIN", "SUPER_ADMIN"), upload.single("image"), createGallery);

router.get("/", authMiddleware, roleMiddleware("ADMIN", "SUPER_ADMIN"), getAllGallery);

router.delete("/:id", authMiddleware, roleMiddleware("ADMIN", "SUPER_ADMIN"), deleteGallery);

export default router;