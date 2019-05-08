const multer = require('multer')
const AppConfig = require('../util/AppConfig')

// multer configuration
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, `${AppConfig.filesDestination}/`),
    filename: (req, file, cb) => cb(null, file.originalname)
  }),
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: (req, file, cb) => {
    if(
      file.mimetype === 'image/jpeg',
      file.mimetype === 'image/jpg',
      file.mimetype === 'image/png'
    ) cb(null, true)
    else cb(null, false)
  }
})


module.exports = upload