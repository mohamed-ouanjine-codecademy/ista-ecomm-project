// backend/routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.post('/', protect, admin, upload.single('image'), (req, res) => {
  // Replace backslashes with forward slashes in the file path
  const imageUrl = `/${req.file.path.replace(/\\/g, '/')}`;
  res.status(201).json({ imageUrl });
});


module.exports = router;
