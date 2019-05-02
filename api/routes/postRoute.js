const express = require('express')
const router = express.Router()


const ResponseConfig = require('../../util/ResponseConfig')


const Post = require('../models/postModel')
const Author = require('../models/authorModel')



// GET 
router.get('/getPostList', (req, res, next) => {

  Post.find()
    .populate('author', ' _id name position email quote social ')
    .exec()
    .then( result => {
      const msg = 'post list fetched...'
      const _res = {
        count: result.length,
        posts: result.map( post => ({
          ...post._doc
        }))
      }

      res.status(200).json(ResponseConfig.success(200, msg, _res))
    })
    .catch(err => {
      const msg = 'cannot get posts list'
      res.status(500).json(ResponseConfig.failure(500, msg))
    })
})




// GET:id
router.get('/getPost/:postId', (req, res, next) => {
  const postId = req.params.postId

  Post.findById(postId)
    .populate('author', ' _id name position email quote longDes social ')
    .exec()
    .then( post => {
      if(post) {
        const msg = 'post fetched successfully...'
        res.status(200).json(ResponseConfig.success(200, msg, post._doc))
      } else {
        const msg = 'post id is not correct probably...'
        res.status(500).json(ResponseConfig.failure(500, msg))
      }
    })
    .catch( err => {
      const msg = 'server error, there was a problem fetching post...'
      res.status(500).json(ResponseConfig.failure(500, msg))
    })
})



// POST 
router.post('/createPost', async (req, res, next) => {
  const { title, shortDes, tags, author, postData} = req.body


  if(!title || title.trim().length === 0) res.status(500).json(ResponseConfig.failure(500, 'you should provide title...'))
  if(!shortDes || shortDes.trim().length === 0) res.status(500).json(ResponseConfig.failure(500, 'you should provide shortDes...'))
  if(!tags || tags.length === 0) res.status(500).json(ResponseConfig.failure(500, 'you should provide tags...'))
  if(!postData || postData.trim().length === 0) res.status(500).json(ResponseConfig.failure(500, 'you should provide postData...'))
  if(!author || author.trim().length === 0) res.status(500).json(ResponseConfig.failure(500, 'you should provide author...'))
  else {
    Author.model.findById(author)
      .then()
      .catch( err => {
        res.status(500).json(ResponseConfig.failure(500, 'author is not found...'))
      })
  }



  const post = new Post({
    ...req.body
  })

  let result = await post.save();

    let authorData = await Author.model.findById(author, 
      Author.propGeneral)
      
    const msg = 'Post is been Created...'
    const response = { createdPost: Object.assign({}, { ...result._doc }, { author: authorData }) }
    
    res.status(201).json(ResponseConfig.success(201, msg, response))

    })



module.exports = router