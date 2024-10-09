const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const path = require('path');

const app = express();
const PORT = 3000;

// Set up the multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Directory to store uploaded PDFs
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Serve a simple upload form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));  // Simple HTML form
});

// Handle file upload and PDF parsing
app.post('/upload', upload.single('pdf'), (req, res) => {
  const filePath = req.file.path;

  pdfParse(req.file).then((data) => {
    // Send the extracted text as a response
    res.send(`<h3>Extracted Text:</h3><pre>${data.text}</pre>`);
  }).catch((error) => {
    res.status(500).send('Error parsing PDF');
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
