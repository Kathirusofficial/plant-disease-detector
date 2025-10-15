require('dotenv').config();
const mongoose = require('mongoose');

// Image upload schema
const imageSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  mimetype: String,
  size: Number,
  uploadDate: { type: Date, default: Date.now },
  diagnosis: String,
  treatment: String,
  confidence: String
});
const UploadedImage = mongoose.model('UploadedImage', imageSchema);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const express = require("express");
// Removed mongoose, bcryptjs, jsonwebtoken for mock backend
const cors = require("cors");

const app = express();

// Serve static files from public folder FIRST
app.use(express.static("public"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Get all uploaded images and diagnoses
app.get('/api/images', async (req, res) => {
  try {
    const images = await UploadedImage.find().sort({ uploadDate: -1 });
    res.json({ success: true, images });
  } catch (err) {
    res.status(500).json({ success: false, message: 'MongoDB fetch error', error: err.message });
  }
});
// Serve static files from public folder FIRST
app.use(express.static("public"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// PORT already declared below
// No JWT_SECRET needed for mock backend

// ----------------- MongoDB Connection Removed -----------------

// No user schema or JWT needed for mock backend

// ----------------- Routes -----------------

// Mock Register (no database, always succeed)
app.post("/api/register", (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }
  // Always succeed and return a fake token
  const token = "demo-token-" + Math.random().toString(36).substring(2);
  res.json({ success: true, user: { name, email }, token });
});

// Mock Login (no database, always succeed)
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }
  // Always succeed and return a fake token
  const token = "demo-token-" + Math.random().toString(36).substring(2);
  res.json({
    success: true,
    token,
    user: { name: "Demo User", email },
  });
});

// Mock AI analyze endpoint with file upload
app.post('/api/analyze', upload.single('plantPhoto'), async (req, res) => {
  const mockDiseases = [
    {
      name: "Leaf Blight",
      treatment: "Remove affected leaves, apply fungicide, improve air circulation."
    },
    {
      name: "Powdery Mildew",
      treatment: "Spray with neem oil, avoid overhead watering, increase sunlight."
    },
    {
      name: "Root Rot",
      treatment: "Reduce watering, repot in dry soil, trim damaged roots."
    }
  ];
  const result = mockDiseases[Math.floor(Math.random() * mockDiseases.length)];
  try {
    const imgDoc = await UploadedImage.create({
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      diagnosis: result.name,
      treatment: result.treatment,
      confidence: (Math.random() * 0.5 + 0.5).toFixed(2)
    });
    res.json({
      success: true,
      diagnosis: {
        label: imgDoc.diagnosis,
        treatment: imgDoc.treatment,
        confidence: imgDoc.confidence
      },
      imageId: imgDoc._id
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'MongoDB save error', error: err.message });
  }
});

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});


const PORT = process.env.PORT || 3000;
// No JWT_SECRET needed for mock backend

// ----------------- MongoDB Connection Removed -----------------

// No user schema or JWT needed for mock backend

// ----------------- Routes -----------------


// Mock Register (no database, always succeed)
app.post("/api/register", (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }
  // Always succeed and return a fake token
  const token = "demo-token-" + Math.random().toString(36).substring(2);
  res.json({ success: true, user: { name, email }, token });
});

// Mock Login (no database, always succeed)
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }
  // Always succeed and return a fake token
  const token = "demo-token-" + Math.random().toString(36).substring(2);
  res.json({
    success: true,
    token,
    user: { name: "Demo User", email },
  });
});

// ----------------- Start Server -----------------
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
