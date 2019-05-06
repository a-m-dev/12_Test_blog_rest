const express = require('express')
const router = express.Router()


const ResponseConfig = require('../../util/ResponseConfig')


const FeedBack = require('../models/feedbackModel')



// GET 
router.get('/getFeedbackList', async(req, res, next) => {

  try {

    const findResult = await FeedBack.model.find()

    const msg = 'feed backs were fetched...'
    res.status(200).json(ResponseConfig.success(200, msg, findResult))
  } catch(err){
    const msg = 'threre was a problem in fetching feed backs...'
    res.status(500).json(ResponseConfig.failure(500, msg))
  }
})



// GET:id
router.get('/getFeedback/:feedbackId', async(req, res, next) => {

  const feedbackId = req.params.feedbackId

  try {

  } catch(err) {
    
  }

})


// POST
router.post('/createFeedback', async (req, res, next) => {

  try {
    const feedback = new FeedBack.model({
      username: req.body.username || 'Anonymous',
      feedback: req.body.feedback || '',
      isActive: req.body.isActive || false
    })

    let feedBackSaveResult = await FeedBack.save()

    const msg = 'feedback is been saved...'
    res.status(201).json(ResponseConfig.success(201, msg, feedBackSaveResult._doc))
  } catch(err) {
    const msg = 'cannot create feed back...'
    res.status(500).json(ResponseConfig.failure(500, msg))
  }
})



// PUT 
router.put('/editFeedback/:feedbackId', async(req, res, next) => {
  const toBeUpdated = req.body
  const feedbackId = req.params.feedbackId

  try {

    const foundFeedback = await FeedBack.model.find(feedbackId)

    if(!feedbackId) {
      const msg = 'there was no feed back found...'
      res.status(404).json(ResponseConfig.failure(404, msg))
    }

    try {

      const newFeedBack = Object.assign({}, foundFeedback._doc, {...toBeUpdated})

      const updationResult = await FeedBack.model.findByIdAndUpdate({ _id: feedbackId }, newFeedBack, { new: true })

      const msg = 'feedback is been created...'
      res.status(200).json(ResponseConfig.success(200, msg, updationResult._doc))
    } catch(err) {
      const msg = 'cannot update feedback...'
      res.status(500).json(ResponseConfig.failure(500, msg))
    }
  } catch (err) {
    const msg = 'there was a problem in updating the feedback...'
    res.status(500).json(ResponseConfig.failure(500, msg))
  }
})