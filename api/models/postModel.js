const mongoose = require('mongoose')



const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  shortDes: { type: String, required: true },
  tags: [ String ],
  createdAt: { type: Date },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
  likes: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  postData: { type: String, required: true },
  // cover: { type:  }
  
  isPublished: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  isSlider: { type: Boolean, default: false }
})


module.exports = mongoose.model('Post', postSchema)