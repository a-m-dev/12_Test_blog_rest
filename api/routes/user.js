const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user')




// POST 
router.post('/signup', (req, res, next) => {

  console.log(req.body)

  res.status(200).json({
    message: 'wassap',
    b: req.body
  })

})



module.exports = router