const express = require('express')
const router = express.Router()


const RequestConfig = require('../../util/ResponseConfig')

const Hashtag = require('../models/hashtagsModel')





// GET 
router.get('/getHashtagList', async(req, res, next) => {
  try {
    const hashtagData = await Hashtag.model.find()

    const msg = 'hashtags fetched successfully...'
    res.status(200).json(RequestConfig.success(200, msg, hashtagData))
  } catch(err) {
    const mag = 'cannot fetch hashtags...'
    res.status(500).json(RequestConfig.failure(500, msg))
  }
})




// POST
router.post('/getHashtag/:hashtagId', async(req, res, next) => {

  const id = req.params.HashtagId
  const data = req.body

  
  try {
    const hashtagData = await Hashtag.model.findById(id)

    if(!hashtagData) {
      const msg = 'there is no hashtag like that...'
      res.status(500).json(RequestConfig.failure(500, msg))
    }
    
    const hashtag = new Hashtag.modle({
      ...data
    })

    try {

      let result = await hashtag.save()
      
      const msg = 'hashtag is been created...'
      res.status(201).json(RequestConfig.success(201, msg, result._doc))
    } catch(err) {
      const msg = 'there was a problem in saving author...'
      res.status(500).json(RequestConfig.failure(500, msg))
    }
  } catch(err) {
    const msg = 'there was a server problem in saving the hashtag...'
    res.status(500).json(RequestConfig.failure(500, msg))
  }
})





module.exports = router