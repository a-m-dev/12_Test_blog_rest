const express = require('express')
const router = express.Router()


const ResponseConfig = require('../../util/ResponseConfig')


const Post = require('../models/postModel')
const Author = require('../models/authorModel')



// GET 
router.get('/getPostList', async (req, res, next) => {

  try {
    const findResult = await Post
      .find()
      .populate('author', ' _id name position email quote social ')
      // .exec()

    const _res = {
      count: findResult.length,
      posts: findResult.map( post => ({
        ...post._doc
      }))
    }

    const msg = 'fetched successfully...'
    res.status(200).json(ResponseConfig.success(200, msg, _res))
  } catch (err) {
    const msg = 'cannot get posts list'
    res.status(500).json(ResponseConfig.failure(500, msg))
  }

  // Post.find()
  //   .populate('author', ' _id name position email quote social ')
  //   .exec()
  //   .then( result => {
  //     const msg = 'post list fetched...'
  //     const _res = {
  //       count: result.length,
  //       posts: result.map( post => ({
  //         ...post._doc
  //       }))
  //     }

  //     res.status(200).json(ResponseConfig.success(200, msg, _res))
  //   })
  //   .catch(err => {
  //     const msg = 'cannot get posts list'
  //     res.status(500).json(ResponseConfig.failure(500, msg))
  //   })
})




// GET:id
router.get('/getPost/:postId', async (req, res, next) => {
  const postId = req.params.postId


  try {
    const findResult = await Post.findById(postId).populate('author', ' _id name position email quote longDes social ')
    if(findResult) {
      const msg = 'post fetched successfully...'
      res.status(200).json(ResponseConfig.success(200, msg, findResult._doc))
    } else {
      const msg = 'post id is not correct probably...'
      res.status(500).json(ResponseConfig.failure(500, msg))
    }
  } catch(err) {
    const msg = 'server error, there was a problem fetching post...'
    res.status(500).json(ResponseConfig.failure(500, msg))
  }


  // Post.findById(postId)
  //   .populate('author', ' _id name position email quote longDes social ')
  //   .exec()
  //   .then( post => {
  //     if(post) {
  //       const msg = 'post fetched successfully...'
  //       res.status(200).json(ResponseConfig.success(200, msg, post._doc))
  //     } else {
  //       const msg = 'post id is not correct probably...'
  //       res.status(500).json(ResponseConfig.failure(500, msg))
  //     }
  //   })
  //   .catch( err => {
  //     const msg = 'server error, there was a problem fetching post...'
  //     res.status(500).json(ResponseConfig.failure(500, msg))
  //   })
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

  try {
    let result = await post.save();
    let authorData = await Author.model.findById(author, Author.propGeneral)
    const msg = 'Post is been Created...'
    const response = { createdPost: Object.assign({}, { ...result._doc }, { author: authorData }) }
    res.status(201).json(ResponseConfig.success(201, msg, response))
  } catch (err) {
    const msg = 'there was a problem in saving the author...'
    res.status(500).json(ResponseConfig.failure(500, msg))
  }

})



// PUT
router.put('/editPost/:postId', async(req, res, next) => {
  const toBeUpdated = req.body
  const postId = req.params.postId

  try {
    const postData = await Post.findById(postId) //.populate('author', ' _id name position email quote longDes social ')

    if(!postData._doc) {
      const msg = 'there is no post data like that...'
      res.status(500).json(ResponseConfig.failure(500, msg))
    }

    
    try {
      const newPost = Object.assign({}, postData._doc, {...toBeUpdated})
      const updationResult = await Post.findByIdAndUpdate({ _id: postId }, newPost, { new: true })
        .populate('author', Author.model.propGeneral)

      const msg = 'post is been updated...'
      res.status(200).json(ResponseConfig.success(200, msg, updationResult._doc))
    } catch(err) {
      const msg = 'there was a problem during updating...'
      res.status(500).json(ResponseConfig.failure(500, msg))
    }

  } catch(err) {
    const msg = 'there is a server problem...'
    res.status(500).json(ResponseConfig.failure(500, msg))
  }

})



// DELETE 
router.delete('/deletePost/:postId', async(req,res, next) => {
  const postId = req.params.postId

  try {
    const postData = await Post.findById(postId) //.populate('author', ' _id name position email quote longDes social ')

    if(!postData._doc) {
      const msg = 'there is no post data like that...'
      res.status(500).json(ResponseConfig.failure(500, msg))
    } else {
      try {
        const findAndDeleteResult = await Post.findByIdAndRemove(postId)
  
        const msg = 'post deleted SuccessFUlly...'
        res.status(200).json(ResponseConfig.success(200, msg, findAndDeleteResult))
      } catch(err) {
        const msg = 'cannot remove the post...'
        res.status(500).json(ResponseConfig.failure(500, msg))
      }
    }

  } catch(err) {
    const msg = 'cannot remove the post...'
    res.status(500).json(ResponseConfig.failure(500, msg))
  }
})

module.exports = router