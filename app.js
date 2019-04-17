const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const AppConfig = require('./util/AppConfig')
const mongoose = require('mongoose')


const userRoutes = require('./api/routes/user')




// DB Setup 
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/u10q_blog', 
  { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true }
)


// body parser 
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// CORS
app.use(( req, res, next ) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  if(req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
    return res.status(200).json({
      message: '__OK__'
    })
  }

  next()
})




// Rest Api EndPoints
app.use(`/api/${AppConfig.apiVersion}/user`, userRoutes)






// error Handeling 
app.use((req, res, next) => {
  const err = new Error('Not Found Error')
  err.status = 404
  next(err)
})

app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.json({
    error: {
      message: err.message
    }
  })
})


module.exports = app