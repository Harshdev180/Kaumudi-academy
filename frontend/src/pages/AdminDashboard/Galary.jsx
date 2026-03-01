import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UploadCloud, Trash2, Plus } from "lucide-react";
import { api } from "../../lib/api";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  /* =========================
     FETCH IMAGES
  ========================= */
  const fetchImages = async () => {
    try {
      const res = await api.get("/gallery");

      // Handle both possible formats safely
      const galleryData = Array.isArray(res.data)
        ? res.data
        : res.data.data || [];

      setImages(galleryData);
    } catch (error) {
      console.error(error);
      setImages([]); // prevent crash
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  /* =========================
     HANDLE IMAGE UPLOAD
  ========================= */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("title", "Gallery Image");
      formData.append("image", file);

      await api.post("/gallery", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      fetchImages(); // refresh images
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  /* =========================
     DELETE IMAGE
  ========================= */
  const deleteImage = async (id) => {
    try {
      await api.delete(`/gallery/${id}`);
      fetchImages();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1e4c8] p-8">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-serif font-bold text-[#74271E]">
          Gallery Management
        </h1>

        {/* Add Images Button */}
        <label className="cursor-pointer">
          <input
            type="file"
            onChange={handleImageUpload}
            className="hidden"
          />

          <motion.span
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#74271E] text-white font-semibold shadow-lg"
          >
            <Plus size={18} />
            {uploading ? "Uploading..." : "Add Image"}
          </motion.span>
        </label>
      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-[#74271E] font-semibold">Loading images...</p>
      )}

      {/* NO IMAGES */}
      {!loading && images?.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-24 text-center">
          <UploadCloud size={60} className="text-[#d6b15c]" />
          <p className="mt-6 text-xl font-serif text-[#74271E]">
            No images uploaded yet
          </p>
          <p className="text-[#74271E]/60 mt-2">
            Click "Add Image" to upload your first gallery image.
          </p>
        </div>
      )}

      {/* IMAGE GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {images.map((img) => (
          <motion.div
            key={img._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative group rounded-3xl overflow-hidden shadow-xl bg-white"
          >
            <img
              src={img.image}
              alt={img.title}
              className="w-full h-56 object-cover transition duration-500 group-hover:scale-105"
            />

            {/* Delete Button */}
            <button
              onClick={() => deleteImage(img._id)}
              className="absolute top-4 right-4 bg-[#74271E] text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
            >
              <Trash2 size={16} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}