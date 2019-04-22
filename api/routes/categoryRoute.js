const express = require('express')
const router = express.Router()

const ResponseConfig = require('../../util/ResponseConfig')

const Category = require('../models/categoryModel')




// GET 
router.get('/getCategoryList', (req, res, next) => {
  Category.find()
    .select(' _id name, description isActive ')
    .exec()
    .then( result => {
      const _res = {
        count: result.length,
        categories: result.map( cat => {
          return {
            _id: cat._id,
            name: cat.name,
            description: cat.description,
            isActive: cat.isActive,
            // request: {
            //   type: 'get',
            //   url: `http://localhost:3010/api/1.0.0/category/getCategory/${cat._id}`
            // }
          }
        })
      }
      res.status(200).json(ResponseConfig.success(200, _res))
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

        res.status(200).json(ResponseConfig.success.apply(this, [200, ...Array(1).concat([_result])]))
      } else {
        const msg = 'there was no catogory like that...'
        res.status(404).json(ResponseConfig.failure(404, msg))
      }
    })
    .catch( err => {
      console.log(err)
      res.status(500).json({ error: err })
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
        request: {
          type: 'get',
          url: `http://localhost:3010/api/1.0.0/category/${_id}`
        }
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



// PATCH 
router.patch

module.exports = router;