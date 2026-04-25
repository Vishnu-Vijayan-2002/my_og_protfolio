import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './database.js';

import path from 'path';
import { fileURLToPath } from 'url';

import multer from 'multer';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files from the React app dist folder
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

// Auth middleware
const authenticate = (req, res, next) => {
  const secret = req.headers['x-admin-secret'];
  if (secret === ADMIN_PASSWORD) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};

// Login route
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true, secret: ADMIN_PASSWORD });
  } else {
    res.status(401).json({ success: false, message: "Invalid password" });
  }
});

// Upload route
app.post('/api/upload', authenticate, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const filePath = `/uploads/${req.file.filename}`;
  res.json({ filePath });
});

// Get all projects
app.get('/api/projects', (req, res) => {
  db.all("SELECT * FROM projects", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add a new project (Protected)
app.post('/api/projects', authenticate, (req, res) => {
  const { title, details, image, github, web } = req.body;
  if (!title) {
    res.status(400).json({ error: "Title is required" });
    return;
  }
  const query = `INSERT INTO projects (title, details, image, github, web) VALUES (?, ?, ?, ?, ?)`;
  db.run(query, [title, details, image, github, web], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, message: "Project added successfully" });
  });
});

// Delete a project (Protected)
app.delete('/api/projects/:id', authenticate, (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM projects WHERE id = ?", id, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: "Project deleted successfully", deleted: this.changes });
  });
});

// Update a project (Protected)
app.put('/api/projects/:id', authenticate, (req, res) => {
  const id = req.params.id;
  const { title, details, image, github, web } = req.body;
  
  if (!title) {
    res.status(400).json({ error: "Title is required" });
    return;
  }

  const query = `UPDATE projects SET title = ?, details = ?, image = ?, github = ?, web = ? WHERE id = ?`;
  db.run(query, [title, details, image, github, web, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: "Project updated successfully", updated: this.changes });
  });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
