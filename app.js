const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const AppConfig = require('./util/AppConfig')
const mongoose = require('mongoose')


// const userRoutes = require('./api/routes/userRoute')
const categoryRoutes = require('./api/routes/categoryRoute')
const authorRoutes = require('./api/routes/authorRoute')
const postRoutes = require('./api/routes/postRoute')
const hashtagRoutes = require('./api/routes/hashtagRoute')
const feedbackRoutes = require('./api/routes/feedbackRoute')

const testRotue = require('./api/routes/testMediaRoute')



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
  res.header('X-Powered-By', 'Power of Js...')
  res.header('X-XSS-Protection' , 0 );
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
// app.use(`/api/${AppConfig.apiVersion}/user`, userRoutes)
app.use(`/api/${AppConfig.apiVersion}/category`, categoryRoutes)
app.use(`/api/${AppConfig.apiVersion}/author`, authorRoutes)
app.use(`/api/${AppConfig.apiVersion}/post`, postRoutes)
app.use(`/api/${AppConfig.apiVersion}/hashtag`, hashtagRoutes)
app.use(`/api/${AppConfig.apiVersion}/feedback`, feedbackRoutes)

app.use(`/api/${AppConfig.apiVersion}/media`, testRotue)
app.use(`/uploads`, express.static('uploads'))





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