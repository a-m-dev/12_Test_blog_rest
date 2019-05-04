const mongoose = require('mongoose')


const authorSchema = mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  // avatar
  // cover
  email: { type: String, required: true, unique: true, match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/ },
  password: { type: String, required: true },
  quote: { type: String, required: true },
  longDes: { type: String, required: true },
  isSuspend: { type: Boolean, default: false },
  social: [
    { type: String },
  ],
  posts: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Post' } 
  ]
})

module.exports = {
  model: mongoose.model('Author', authorSchema),
  propGeneral : ['social', 'name', 'position']
}