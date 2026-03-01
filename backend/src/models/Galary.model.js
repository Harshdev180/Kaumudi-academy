import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        image: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true, // adds createdAt & updatedAt automatically
    }
);

const Gallery = mongoose.model("Gallery", gallerySchema);

export default Gallery;