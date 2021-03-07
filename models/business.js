const mongoose = require("mongoose");
const { TRUE } = require("node-sass");

const Schema = mongoose.Schema;

const businessSchema = new Schema({
  businessName: {
    type: String,
    required: true,
  },
  businessOwner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  businessLocationLong: {
    type: String,
    required: true
  },
  businessLocationLang: {
    type: String,
    required: true
  },
  comments: {
    comment: {
      commentId: { type: Schema.TypesObjectId, required: true}
    }
  }
})

module.exports = mongoose.model('Business', businessSchema)