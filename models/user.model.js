const { Schema } = require('mongoose');

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password_hash: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  }
});

module.exports = function makeModel(connection) {
  return connection.model('User', UserSchema);
}