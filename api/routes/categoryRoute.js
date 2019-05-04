const express = require('express')
const router = express.Router()

const ResponseConfig = require('../../util/ResponseConfig')

const Category = require('../models/categoryModel')




// GET 
router.get('/getCategoryList', (req, res, next) => {
  Category.find()
    .select(' _id name features description isActive ')
    .exec()
    .then( result => {
      const _res = {
        count: result.length,
        categories: result.map( cat => {
          return {
            _id: cat._id,
            name: cat.name,
            description: cat.description,
            featured: cat.features,
            isActive: cat.isActive,
          }
        })
      }
      res.status(200).json(ResponseConfig.success.apply(this, [200, ...Array(1).concat([_res])]))
    })
    .catch( err => {
      res.status(500).json(ResponseConfig.failure(500, err))
    })
})


// GET/:id
router.get('/getCategory/:catId', (req, res, next) => {
  const id = req.params.catId
  Category.findById(id)
    .select(' _id name description isActive ')
    .exec()
    .then( cat => {
      if(cat) {
        const _result = { category: cat }

        const msg = 'fetch successful...'
        res.status(200).json(ResponseConfig.success(200, msg, _result))
      } else {
        const msg = 'there was no catogory like that...'
        res.status(404).json(ResponseConfig.failure(404, msg))
      }
    })
    .catch( err => {
      const msg = 'server error, probably the ID that is been provided is not correct...'
      res.status(500).json(ResponseConfig.failure(500, msg))
    })
})



// POST 
router.post('/createCategory', (req, res, next) => {

  const { name, description, isActive } = req.body
  const category = new Category({
    name, description, isActive
  })

  category
    .save()
    .then(result => {

      const { _id, name, description, isActive } = result

      const msg = 'Category is been created...'
      const _result = {
        createdCategory: { _id, name, description, isActive },
      }
      res.status(201).json(ResponseConfig.success(201, msg, _result))
    })
    .catch( err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
})


// PUT
router.put('/diactivateCategory', async (req, res, next) => {
  const { id } = req.body

  Category
    .findByIdAndUpdate(
      { _id: id },
      { $set: { isActive: false } },
      { new: true }
    )
    .then( result => {
      const msg = 'Category Diactivated Successfully...'
      res.status(200).json(ResponseConfig.success(200, msg, result._doc))
    }).catch( err => {
      const msg = 'Cannot Diactivate the Category...'
      res.status(405).json(ResponseConfig.failure(405, msg))
    })
})


// DELETE 
router.delete('/removeCategory', (req, res, next) => {
  const { id } = req.body

  Category // find first 
    .findById(id)
    .then( result => {

      if(result !== null) {
        Category
          .findByIdAndRemove(id) // thene remove it
          .then( result => {
            const msg = 'Category Deleted Successfully...'
            res.status(200).json(ResponseConfig.success(200, msg, result._doc))
          }).catch( err => {
            const msg = 'Cannot Delete the record...'
            res.status(500).json(ResponseConfig.failure(500, msg))
          })
      } else {
        const msg = 'there is no category like with that id...'
        res.status(404).json(ResponseConfig.failure(404, msg))
      }
    })
    .catch( err => {
      const msg = 'there is no category like with that id...'
      res.status(404).json(ResponseConfig.failure(404, msg))
    })
})


module.exports = router;