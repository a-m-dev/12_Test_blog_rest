const express = require('express')
const router = express.Router()

const ResponseConfig = require('../../util/ResponseConfig')

const Author = require('../models/authorModel')




// GET 
router.get('/getAuthorList', (req, res, next) => {
  Author.model.find()
    .select(' _id name position email quote longDes social posts')
    .exec()
    .then( result => {
      const msg = 'fetched successsfully...'
      const _res = {
        count: result.length,
        authors: result.map( author => ({
          _id: author._id,
          name: author.name, 
          position: author.position,
          email: author.email,
          quote: author.quote,
          longDes: author.longDes,
          social: author.social,
          posts: author.posts,
        }))
      }
      res.status(200).json(ResponseConfig.success(200, msg, _res))
    })
    .catch( err => {
      const msg = 'cannot get list of authors...'
      res.status(500).json(ResponseConfig.failure(500, msg))
    })
})


// GET/:id
router.get('/getAuthor/:authorId', (req,res, next) => {
  const authorId = req.params.authorId

  Author.model.findById(authorId)
    .select(' _id name position email quote longDes social posts ')
    .exec()
    .then( author => {
      if(author) {
        const _result = { author }
        res.status(200).json(ResponseConfig.success.apply(this, [200, ...Array(1).concat([_result])]))
      } else {
        const msg = 'author id is not correct probably...'
        res.status(404).json(ResponseConfig.failure(404, msg))
      }
    })
    .catch( err => {
      const msg = 'server error, there was a problem fetching the author...'
      res.status(500).json(ResponseConfig.failure(500, msg))
    })
})


// POST
router.post('/defineAuthor', (req, res, next) => {
  const { name, position, email, password, quote, longDes } = req.body

  const author = Author.model({
    name, position, email, password, quote, longDes
  })

  author
    .save()
    .then(result => {
      const { _id, name, position, email, password, quote, longDes } = result

      const msg = 'Author is been defined...'
      const response = {
        definedAuthor: { _id, name, position, email, password, quote, longDes },
      }

      res.status(201).json(ResponseConfig.success(201, msg, response))
    })
    .catch( err => {
      console.log(err)
      const msg = 'Cannot define Author...'
      res.status(500).json(ResponseConfig.failure(500, msg))
    })
})





// DELETE
router.delete('/removeAuthor/:authorId', (req, res, next) => {
  const id = req.params.authorId

  Author.model.findById(id)
    .then( author => {
      
      if(author) {
        Author.model.findByIdAndRemove(id)
          .then( result => {
            const msg = 'author deleted successfully...'
            res.status(200).json(ResponseConfig.success(200, msg, result._doc))
          })
          .catch( err => {
            const msg = 'cannot delete the author...'
            res.status(500).json(ResponseConfig.failure(500, msg))
          })
      } else {
        const msg = 'there is not author with that id...'
        res.status(404).json(ResponseConfig.failure(404, msg))
      }
    })
    .catch( err => {
      const msg = 'there is no author with that id...'
      res.status(404).json(ResponseConfig.failure(404, msg))
    })
})



module.exports = router