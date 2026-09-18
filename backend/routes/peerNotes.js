import express from "express";
import multer from "multer";
import path from "path";
import crypto from "crypto";
import { requireUser } from "../middleware/auth.js";
import { query } from "../db/index.js";
import { uploadNote } from "../lib/r2Notes.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

const allowedFiles = {
  pdf: "application/pdf",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

router.post(
  "/upload",
  requireUser,
  upload.single("file"),
  (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: "File must be 10MB or smaller" });
    }
    next(err);
  },
  async (req, res) => {
    // 1. Check that a file was actually uploaded
    if (!req.file) {
      return res.status(400).json({
        error: "File is required",
      });
    }

    // 2. Get the extension from the original filename
    const ext = path.extname(req.file.originalname).toLowerCase().slice(1);

    // 3. Check extension
    if (!allowedFiles[ext]) {
      return res.status(400).json({
        error: "File type is not allowed",
      });
    }

    // 4. Check MIME type too
    if (req.file.mimetype !== allowedFiles[ext]) {
      return res.status(400).json({
        error: "File MIME type does not match its extension",
      });
    }

    // 5. Validate subjectCode
    if (!req.body.subjectCode) {
      return res.status(400).json({
        error: "subjectCode is required",
      });
    }
    // 6. Validate title
    if (!req.body.title) {
      return res.status(400).json({
        error: "title is required",
      });
    }

    if (req.body.title.length > 120) {
      return res.status(400).json({
        error: "title must be 120 characters or fewer",
      });
    }

    const isAnonymous = req.body.isAnonymous === "true";

    if (!isAnonymous && !req.body.uploaderName?.trim()) {
      return res.status(400).json({
        error: "Uploader name is required when the note is not anonymous",
      });
    }

    try {
      // Rate limit: 5 uploads per user per 24 hours (Phase 0)
      const usage = await query(
        `SELECT COUNT(*) FROM api_usage
         WHERE user_id = $1 AND endpoint = $2 AND called_at > NOW() - INTERVAL '24 hours'`,
        [req.userId, "/api/peer-notes/upload"]
      );
      if (parseInt(usage.rows[0].count, 10) >= 5) {
        return res.status(429).json({
          error: "Upload limit reached. Try again in 24 hours.",
        });
      }

      // Upload to R2
      const key = `${req.body.subjectCode}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
      const fileUrl = await uploadNote(req.file.buffer, key, req.file.mimetype);

      // Insert the note, unapproved until admin reviews it
      const result = await query(
        `INSERT INTO peer_notes
          (user_id, subject_code, title, is_anonymous, uploader_name, file_key, file_url, file_type, mime_type, file_size_bytes, is_approved)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, false)
         RETURNING *`,
        [
          req.userId,
          req.body.subjectCode,
          req.body.title,
          isAnonymous,
          isAnonymous ? null : req.body.uploaderName.trim(),
          key,
          fileUrl,
          ext,
          req.file.mimetype,
          req.file.size,
        ]
      );

      // Log this upload for the rate limit check above
      await query(
        `INSERT INTO api_usage (user_id, ip_address, endpoint) VALUES ($1, $2, $3)`,
        [req.userId, req.ip, "/api/peer-notes/upload"]
      );

      return res.status(201).json({ note: result.rows[0] });
    } catch (err) {
      console.error("Peer note upload error:", err.message);
      return res.status(500).json({ error: "Could not upload note." });
    }
  },
);

export default router;
