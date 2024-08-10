const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const multer = require('multer')

const app = express()

app.use(cors())

// Multer configuration
// const uploadPath = path.join('D:', '64101', 'project-fontend', 'public', 'uploads');
const uploadPath = path.join('../public/uploads/')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Check if the directory exists, create it if it does not
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() + '-' + Math.random().toString(36).substring(2, 15)
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, uniqueSuffix + ext)
  },
})

const upload = multer({ storage })

// API endpoints
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' })
  }
  res.json({
    message: 'File uploaded successfully',
    filePath: `/uploads/${req.file.filename}`,
  })
})

app.listen(3001, () => {
  console.log('Server is running on port 3001')
})
