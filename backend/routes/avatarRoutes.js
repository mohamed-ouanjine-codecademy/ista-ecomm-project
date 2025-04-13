// backend/routes/avatarRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/auth');

// This route allows any authenticated user (not just admin) to upload an image (for their avatar)
router.post('/', protect, upload.single('image'), (req, res) => {
  // Replace any backslashes with forward slashes in the file path
  const imageUrl = `/${req.file.path.replace(/\\/g, '/')}`;
  res.status(201).json({ imageUrl });
});

module.exports = router;
