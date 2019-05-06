const mongoose = require('mongoose')
const feedbackSchema = new mongoose.Schema({
  username: { type: String, required: true },
  //  avatar
  feedback: { type: String, required: true },
  isActive: { type: Boolean, default: false }
})


module.exports = {
  model: mongoose.model('Feedback', feedbackSchema),
  propGeneral: ['username', 'feedback', 'isActive']
}