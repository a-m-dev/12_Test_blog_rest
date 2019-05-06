const mongoose = require('mongoose')


const hashtagSchema = mongoose.Schema({
  title: { type: String, required: true },
  createdAt: { type: Date, default: Date.now() },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
  posts: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
  ],
  // cover
  // avatar
  isActive: { type: Boolean, default: false }
})


module.exports = {
  model: mongoose.model('Hashtag', hashtagSchema),
  propGeneral: ['title', 'createdAt', 'createdBy', 'posts', 'isActive']
}