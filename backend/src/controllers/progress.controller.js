import Progress from "../models/CourseProgress.model.js";
import Certificate from "../models/Certificate.model.js";
import Enrollment from "../models/Enrollment.model.js";
import { v4 as uuid } from "uuid";
import fs from "fs";
import path from "path";
import { formatEnrollmentId } from "../utils/enrollment.utils.js";
import mongoose from "mongoose";

export const downloadCertificate = async (req, res) => {
    try {

        const { certificateId } = req.params;

        const cert = await Certificate.findOne({ certificateId })
            .populate("user", "name")
            .populate("course", "title");

        if (!cert) {
            return res.status(404).json({
                success: false,
                message: "Certificate not found",
            });
        }

        const templatePath = path.join(
            process.cwd(),
            "templates",
            "certificate.html"
        );

        let html = fs.readFileSync(templatePath, "utf8");

        html = html
            .replace("{{studentName}}", cert.user.name)
            .replace("{{courseName}}", cert.course.title)
            .replace("{{certificateId}}", cert.certificateId)
            .replace(
                "{{date}}",
                new Date(cert.createdAt).toLocaleDateString()
            );

        res.send(html);

    } catch (error) {
        console.error("Download certificate error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

export const verifyCertificate = async (req, res) => {
  try {

    const { certificateId } = req.params;

    const certificate = await Certificate.findOne({
      certificateId
    })
      .populate("user", "name")
      .populate("course", "title");

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not valid"
      });
    }

    res.json({
      success: true,
      data: certificate
    });

  } catch (error) {
    console.error("Verify certificate error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const updateProgress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { courseId, progress } = req.body;

        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "Course ID required",
            });
        }

        const existing = await Progress.findOne({ user: userId, course: courseId });

        const finalProgress = Math.max(progress, existing?.progress || 0);
        const completed = finalProgress >= 95;

        const updated = await Progress.findOneAndUpdate(
            { user: userId, course: courseId },
            {
                progress: finalProgress,
                completed,
            },
            { new: true, upsert: true }
        );

        if (completed) {
            const exists = await Certificate.exists({
                user: userId,
                course: courseId,
            });

            if (!exists) {
                await Certificate.create({
                    user: userId,
                    course: courseId,
                    certificateId: `CERT-${uuid().slice(0, 8)}`,
                });
            }
        }

        res.json({
            success: true,
            data: updated,
        });
    } catch (error) {
        console.error("Progress update error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

export const getMyCertificates = async (req, res) => {
    try {
        // Use _id for consistency with mongoose
        const userId = req.user._id;

        const certificates = await Certificate.find({ user: userId })
            .populate("course", "title image")
            .sort({ createdAt: -1 });

        // Get user's enrollment ID (formatted like in profile/settings)
        const userEnrollmentId = formatEnrollmentId(userId, req.user.createdAt);

        // For each certificate, set the enrollment ID to the user's enrollment ID
        const certificatesWithEnrollment = certificates.map((cert) => {
            const certObj = cert.toObject();
            // Use the user's enrollment ID (same as shown in profile/settings)
            certObj.enrollmentId = userEnrollmentId;
            return certObj;
        });

        res.json({
            success: true,
            data: certificatesWithEnrollment,
        });
    } catch (error) {
        console.error("Get certificates error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

export const getCourseCertificate = async (req, res) => {
    try {
        const userId = req.user.id;
        const { courseId } = req.params;

        const certificate = await Certificate.findOne({
            user: userId,
            course: courseId,
        }).populate("course", "title image");

        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: "Certificate not found",
            });
        }

        res.json({
            success: true,
            data: certificate,
        });
    } catch (error) {
        console.error("Get certificate error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

export const getProgress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { courseId } = req.params;

        const progress = await Progress.findOne({
            user: userId,
            course: courseId,
        });

        res.json({
            success: true,
            data: progress,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};