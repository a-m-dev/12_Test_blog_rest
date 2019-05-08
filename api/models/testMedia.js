const mongoose =require('mongoose')



const testSchema = new mongoose.Schema({
  hash: { type: String,  required: true },
  caption: { type: String, default: '' },
  mimeType: { type: String , required: true },
  fileInfo: { type: mongoose.Schema.Types.Mixed, required: true },
  filePath: { type: String , required: true }
}, { timestamps: true })

module.exports = {
  model: mongoose.model('testMedia', testSchema),
  propGeneral: ['hash', 'caption', 'mimeType', 'fileInfo']
}