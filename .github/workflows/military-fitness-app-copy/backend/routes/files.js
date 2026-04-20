const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const FileUpload = require('../models/FileUpload');
const verifyToken = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Upload file
router.post('/upload', verifyToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const fileUpload = new FileUpload({
      userId: req.userId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      filePath: `/uploads/${req.file.filename}`,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
    });

    await fileUpload.save();
    res.json(fileUpload);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user files
router.get('/', verifyToken, async (req, res) => {
  try {
    const files = await FileUpload.find({ userId: req.userId }).sort({ uploadedAt: -1 });
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete file
router.delete('/:fileId', verifyToken, async (req, res) => {
  try {
    const fileUpload = await FileUpload.findById(req.params.fileId);

    if (!fileUpload) {
      return res.status(404).json({ error: 'File not found' });
    }

    if (fileUpload.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Delete from disk
    const filePath = path.join(uploadsDir, fileUpload.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await FileUpload.deleteOne({ _id: req.params.fileId });
    res.json({ message: 'File deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Download file
router.get('/download/:fileId', verifyToken, async (req, res) => {
  try {
    const fileUpload = await FileUpload.findById(req.params.fileId);

    if (!fileUpload) {
      return res.status(404).json({ error: 'File not found' });
    }

    if (fileUpload.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const filePath = path.join(uploadsDir, fileUpload.filename);
    res.download(filePath, fileUpload.originalName);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
