const express = require('express')
const router = express.Router()


const ResponseConfig = require('../../util/ResponseConfig')


const FeedBack = require('../models/feedbackModel')



// GET 
router.get('/getFeedbackList', async(req, res, next) => {

  try {

    const findResult = await FeedBack.model.find()


    const _response = {
      count: findResult.length,
      feedbacks: findResult.map(feedback => ({
        ...feedback._doc
      }))
    }
    const msg = 'feed backs were fetched...'
    res.status(200).json(ResponseConfig.success(200, msg, _response))
  } catch(err){
    const msg = 'threre was a problem in fetching feed backs...'
    res.status(500).json(ResponseConfig.failure(500, msg))
  }
})



// GET:id
router.get('/getFeedback/:feedbackId', async(req, res, next) => {

  const feedbackId = req.params.feedbackId

  try {
    const feedbackData = await FeedBack.model.findById(feedbackId)

    // if(!feedbackData) {
    //   res.status(404).json(ResponseConfig.success(404, msg))
    // }
    
    const msg = 'feedback fetched successfully...'
    res.status(200).json(ResponseConfig.success(200, msg, feedbackData._doc))
  } catch(err) {
    const msg = 'there was a problem in server for getting feedback...'
    res.status(404).json(ResponseConfig.failure(404, msg))
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

    let feedBackSaveResult = await feedback.save()

    const msg = 'feedback is been saved...'
    res.status(201).json(ResponseConfig.success(201, msg, feedBackSaveResult._doc))
  } catch(err) {
    const msg = 'cannot create feed back...'
    console.log(err)
    res.status(500).json(ResponseConfig.failure(500, msg))
  }
})



// PUT 
router.put('/editFeedback/:feedbackId', async(req, res, next) => {
  const toBeUpdated = req.body
  const feedbackId = req.params.feedbackId

  try {

    const foundFeedback = await FeedBack.model.findById(feedbackId)

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
    console.log(err)
    res.status(500).json(ResponseConfig.failure(500, msg))
  }
})



router.delete('/removeFeedback/:feedbackId', async (req, res, next) => {
  const feedbackId = req.params.feedbackId

  try {
    const feedback = await FeedBack.model.findById(feedbackId)

    if(!feedback) {
      const msg = 'ther eis no feed back with tat id provided ...'
      res.status(404).json(ResponseConfig.failure(404, msg))
    }

    try {
      const removeFeedbackData = await FeedBack.model.findByIdAndRemove(feedbackId)

      const msg = 'feedback is been removed successfully...'
      res.status(200).json(ResponseConfig.success(200, msg, removeFeedbackData._doc))
    } catch (err) {
      const msg = 'there was a problem while deleting the feedback...'
      res.status(500).json(ResponseConfig.success(500, msg))
    }
  } catch(err) {
    const msg = 'there was a server problem in removing the feedback...'
    console.log(err)
    res.status(500).json(ResponseConfig.failure(500, msg))
  }
})

module.exports = router