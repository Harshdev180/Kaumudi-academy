import Gallery from "../models/Galary.model.js";
import cloudinary from "../configs/cloudinary.js";

export const createGallery = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }

        if (!req.body.title) {
            return res.status(400).json({ message: "Title is required" });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "kaumudi-gallery",
        });

        const gallery = await Gallery.create({
            title: req.body.title,
            image: result.secure_url,
        });

        res.status(201).json({
            success: true,
            message: "Image uploaded successfully",
            data: gallery,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* =========================
   GET ALL GALLERY IMAGES
========================= */
export const getAllGallery = async (req, res) => {
    try {
        const images = await Gallery.find()
            .sort({ createdAt: -1 }); // latest first

        res.status(200).json({
            success: true,
            count: images.length,
            data: images,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteGallery = async (req, res) => {
    try {
        const gallery = await Gallery.findById(req.params.id);
        if (!gallery) return res.status(404).json({ success: false, message: "Image not found" });

        // Extract public_id from Cloudinary URL and delete it
        const publicId = gallery.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`kaumudi-gallery/${publicId}`);

        await gallery.deleteOne();
        res.status(200).json({ success: true, message: "Image deleted successfully" });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};