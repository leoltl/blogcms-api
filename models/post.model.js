const { Schema, SchemaTypes } = require('mongoose');

const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
  published: {
    type: Boolean,
    default: false,
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
});

module.exports = function makeModel(connection) {
  return connection.model('Post', PostSchema);
}