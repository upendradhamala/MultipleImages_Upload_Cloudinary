const express = require('express')
const app = express()
const upload = require('./multer')
const cloudinary = require('./cloudinary')
const fs = require('fs')

app.use(express.json())

app.use('/upload-images', upload.array('image'), async (req, res) => {
  const uploader = async (path) => await cloudinary.uploads(path, 'Images')
  if (req.method === 'POST') {
    const url = []
    const files = req.files
    for (const file of files) {
      const { path } = file
      const newPath = await uploader(path)
      url.push(newPath)
      fs.unlinkSync(path)
    }
    res.status(201).json({ message: 'Images uploaded successfully', data: url })
  } else {
    res.status(400).json({ message: 'Images upload failed' })
  }
})
const PORT = 5000 || process.env.PORT
app.get('/', async (req, res) => {
  res.send('Hello World ')
})
app.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`)
})
