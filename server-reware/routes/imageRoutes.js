const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const router = express.Router();

// Set up storage for uploaded images using multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/images');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to file name
  }
});

const upload = multer({ storage: storage });

// Get all images
router.get('/', (req, res) => {
  const imagesDir = path.join(__dirname, '../uploads/images');

  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      console.error('Error reading images directory:', err);
      return res.status(500).json({ success: false, error: 'Unable to read images directory' });
    }

    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'].includes(ext);
    });

    const imageData = imageFiles.map(file => {
      return {
        filename: file,
        url: `/images/${file}`,
      };
    });

    res.json({ success: true, images: imageData });
  });
});

// Upload an image
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }
  res.json({ success: true, message: 'Image uploaded successfully', filename: req.file.filename });
});

// Delete an image
router.delete('/:filename', (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(__dirname, '../uploads/images', filename);

  if (!fs.existsSync(imagePath)) {
    return res.status(404).json({ success: false, error: 'Image not found' });
  }

  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error('Error deleting image:', err);
      return res.status(500).json({ success: false, error: 'Failed to delete image' });
    }

    res.json({ success: true, message: `Image ${filename} deleted successfully` });
  });
});

// Get specific image metadata
router.get('/:filename', (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(__dirname, '../uploads/images', filename);
  
  // Check if file exists
  if (!fs.existsSync(imagePath)) {
    return res.status(404).json({ 
      success: false, 
      error: 'Image not found' 
    });
  }
  
  const stats = fs.statSync(imagePath);
  const imageData = {
    filename: filename,
    url: `/images/${filename}`,
    size: stats.size,
    uploadDate: stats.birthtime,
    lastModified: stats.mtime
  };
  
  res.json({
    success: true,
    image: imageData
  });
});


module.exports = router;
