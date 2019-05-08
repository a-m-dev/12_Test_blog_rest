const express =require('express')
const router = express.Router()
const Crypto = require('crypto')
const Sharp = require('sharp')

const upload = require('../../services/multer')
const AppConfig = require('../../util/AppConfig')
const testMedia = require('../models/testMedia')


const ResponseConfig = require('../../util/ResponseConfig')




// GET
router.get('/getMedia/:mediaHash', async(req, res, next) => {

  const hash = req.params.mediaHash

  try {
    const found = await testMedia.model.findById({_id: hash})
    res.sendFile(found._doc.filePath)
    // res.status(200).json(ResponseConfig.success(200, 'found...', found._doc))
  } catch(err) {
    const msg = 'failed to fetch image...'
    res.status(500).json(ResponseConfig.failure(500, msg))
  }

})


// POST
router.post('/mediaUpload', upload.single('file'), async (req, res, next) => {
  
  try {
    const fileHash = Crypto.randomBytes(16).toString('hex')
    
    const filePath = `${AppConfig.filesDestination}/${req.file.originalname}`
    const fileData = await Sharp(filePath).metadata()
  
    const _result = {
      hash: fileHash,
      caption: req.body.caption,
      mimeType: req.file.mimetype,
      filePath: filePath,
      fileInfo: {
        width: fileData.width,
        height: fileData.height,
        format: fileData.format
      },
    }
    
    const file = new testMedia.model({
      ..._result
    })
    
    const createdFile = await file.save()

    const msg = 'file is been created...'
    res.status(201).json(ResponseConfig.success(201, msg, createdFile._doc))

  } catch( err ) {
    const msg = 'file could not be saved ...'
    res.status(500).json(ResponseConfig.failure(500, msg))
  }
})



module.exports = router