const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  // features: { type: mongoose.Schema.Types.ObjectId, ref: 'Posts' },
  // posts: { type: mongoose.Schema.Types.ObjectId, ref: 'Posts' },
  // authors: { type: mongoose.Schema.Types.ObjectId, ref: 'Authors' },
  // cover: 

  isActive: { type: Boolean, required: true }
})

module.exports = mongoose.model('Category', categorySchema)