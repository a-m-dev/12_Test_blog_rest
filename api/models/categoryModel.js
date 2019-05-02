const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  features: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Post' } ], 
  posts: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Post' } ],
  authors: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Author' } ],
  // cover: 

  isActive: { type: Boolean, required: true }
})

module.exports = mongoose.model('Category', categorySchema)