const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/userModel')





// GET 
router.get('/list', (req, res, next) => {
    User.find({})
      .select('_id email password')
      .exec()
      .then(result => {

        const response = {
          count: result.length,
          data: result.map( user => ({
            _id: user._id,
            email: user.email,
            password: user.password
          }))
        }

        res.status(200).json(response)
      })
      .catch( err => {
        res.status(500).json({
          error: err
        })
      })
})




// POST 
router.post('/signup', (req, res, next) => {

  const user = new User({
    email: req.body.email,
    password: req.body.password
  })

  user.save()
    .then( result => {
      console.log(result)
      res.status(201).json({
        message: 'user created...',
        userInfo: user
      })
    })
    .catch( err => {
      res.status(200).json({
        message: 'User creation failed...',
        error: err
      })
    })

})



module.exports = router