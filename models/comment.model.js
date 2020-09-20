const { Schema } = require('mongoose');

const CommentSchema = new Schema({
  body: {
    type: String,
  },
  commenter: {
    type: String,
    required: true,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post'
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
  published: {
    type: Boolean,
    default: true,
  }
});

module.exports = function makeModel(connection) {
  return connection.model('Comment', CommentSchema);
}