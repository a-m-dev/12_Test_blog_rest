const express = require('express')
const router = express.Router()


const RequestConfig = require('../../util/ResponseConfig')

const Hashtag = require('../models/hashtagsModel')
const Author = require('../models/authorModel')
const Post = require('../models/postModel')




// GET 
router.get('/getHashtagList', async(req, res, next) => {
  try {
    const hashtagData = await Hashtag.model.find()
      .populate('createdBy', Author.propGeneral)
      .populate('posts', '_id title shortDes tags createdAt author likes shares views postData isPublished isFeatured isSlider')

    const _res = {
      count: hashtagData.length,
      hashtags: hashtagData.map( hashtag => ({
        ...hashtag._doc
      }))
    }

    const msg = 'hashtags fetched successfully...'
    res.status(200).json(RequestConfig.success(200, msg, _res))
  } catch(err) {
    const msg = 'cannot fetch hashtags...'
    res.status(500).json(RequestConfig.failure(500, msg))
  }
})




// GET:id
router.get('/getHashtag/:hashtagId', async(req, res, next) => {
  const hashtagId = req.params.hashtagId

  try {
    const hashtagData = await Hashtag.model.findById(hashtagId)
      .populate('createdBy', Author.propGeneral)
      .populate('posts', '_id title shortDes tags createdAt author likes shares views postData isPublished isFeatured isSlider')

    if(hashtagData) {
      const msg = 'hashtag found!'
      res.status(200).json(RequestConfig.success(200, msg, hashtagData._doc))
    } else {
      const msg = 'hastag id is not correct probably...'
      res.status(500).json(RequestConfig.failure(500, msg))
    }
  } catch(err) {
    const msg = 'hastag id is not correct probably...'
    res.status(500).json(RequestConfig.failure(500, msg))
  }
})



// POST
router.post('/defineHashtag', async(req, res, next) => {

  const data = req.body


  
  try {
    const authorData = await Author.model.findById(req.body.createdBy)

    if(!authorData) {
      const msg = 'there is no Author like that...'
      res.status(500).json(RequestConfig.failure(500, msg))
    }
    
    const hashtag = new Hashtag.model({
      title: req.body.title,
      createdAt: req.body.createdAt || Date.now(),
      createdBy: req.body.createdBy,
      posts: req.body.posts || [],
      isActive: req.body.isActive || false
    })

    try {

      let result = await hashtag.save()
      
      const msg = 'hashtag is been created...'
      res.status(201).json(RequestConfig.success(201, msg, result._doc))
    } catch(err) {
      console.log({ err })
      const msg = 'there was a problem in saving author...'
      res.status(500).json(RequestConfig.failure(500, msg))
    }
  } catch(err) {
    const msg = 'there was a server problem in saving the hashtag...'
    console.log({ err })
    res.status(500).json(RequestConfig.failure(500, msg))
  }
})





// PUT
router.put('/editHashtag/:hashtagId', async(req, res, next) => {
  const toBeUpdated = req.body
  const hashtagId = req.params.hashtagId

  try {
    const hashtagResult = await Hashtag.model.findById(hashtagId)

    if(!hashtagResult._doc) {
      const msg = 'there is no hastag liek that...'
      res.status(404).json(RequestConfig.failure(404, msg))
    }

    try {
      const newHashtag = Object.assign({}, hashtagResult._doc, {...toBeUpdated})
      const updationResult = await Hashtag.model.findByIdAndUpdate({ _id: hashtagId }, newHashtag, { new: true })
        .populate('createdBy', Author.propGeneral)
        .populate('posts', '_id title shortDes tags createdAt author likes shares views postData isPublished isFeatured isSlider')

      const msg = 'hashtag is been updated...'
      res.status(200).json(RequestConfig.success(200, msg, updationResult._doc ))
    } catch(err) {
      const msg = 'there was a problem in updating the hashtag'
      console.log({ err })
      res.status(500).json(RequestConfig.failure(500, msg))
    }
  } catch (err) {
    const msg = 'there was a server problem while updation...'
    res.status(500).json(RequestConfig.failure(500, msg))
  }
})


// DELETE
router.delete('/removeHashtag/:hashtagId' , async (req, res, next) => {
  const hashtagId = req.params.hashtagId

  try {

    const hashtagData = await Hashtag.model.findById(hashtagId)
    
    if(!hashtagData) {
      const msg = 'there is no hastag like that...'
      res.status(404).json(RequestConfig.failure(404, msg))
    }

    try {
      const removedHashtag = await Hashtag.model.findByIdAndRemove(hashtagId)

      const msg = 'hahstag data is been removed successfully...'
      res.status(200).json(RequestConfig.success(200, msg, removedHashtag._doc))
    } catch(err) {
      const msg = 'there was a problem while delteing the hashtag ...'
      res.status(500).json(500, msg)
    }
  } catch(err) {
    console.log(err)
    const msg = 'there was a problem while deleting the hashtag...'
    res.status(500).json(RequestConfig.failure(500, msg))
  }
})


module.exports = router