const crypto = require('crypto');
const jwt = require('jsonwebtoken');

/* credit to https://levelup.gitconnected.com/everything-you-need-to-know-about-the-passport-local-passport-js-strategy-633bbab6195 */
/**
 * 
 * @param {*} password - The plain text password
 * @param {*} hash - The hash stored in the database
 * @param {*} salt - The salt stored in the database
 * 
 * This function uses the crypto library to decrypt the hash using the salt and then compares
 * the decrypted hash/salt with the password that the user provided at login
 */
exports.validPassword = function validPassword(password, hash, salt) {
  const hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return hash === hashVerify;
}
/**
* 
* @param {*} password - The password string that the user inputs to the password field in the register form
* 
* This function takes a plain text password and creates a salt and hash out of it.  Instead of storing the plaintext
* password in the database, the salt and hash are stored for security
* 
* ALTERNATIVE: It would also be acceptable to just use a hashing algorithm to make a hash of the plain text password.
* You would then store the hashed password in the database and then re-hash it to verify later (similar to what we do here)
*/
exports.genPassword = function genPassword(password) {
  const salt = crypto.randomBytes(32).toString('hex');
  const genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  
  return [
    genHash,
    salt,
  ];
}

exports.signJWToken = function signJWToken(subject, tokenOptions={}) {
  const options = {
    expiresIn: process.env.NODE_ENV === 'production' ? '15m': '1d',
    issuer: process.env.JWT_ISSUER || 'blogcms-api.com',
    ...tokenOptions,
    subject, //options should not overide subject
  };
  return `Bearer ${jwt.sign({}, process.env.JWT_SECRET, options)}`
}

// seed user manually to database
exports.seedUser = async function createUser(username, password) {
  require('dotenv').config();
  const dbConnection = await require('../config/db')(process.env.MONGO_URI);
  const User = require('../models/user.model')(dbConnection);
  const [password_hash, salt] = exports.genPassword(password)
  await new User({ username, password_hash, salt}).save()
}


exports.makeDataObjWithValidProps = function makeDataObjWithValidProps(userInputs, schema) {
  let result = {}
  for (key in userInputs) {
    if (key in schema) {
      result[key] = userInputs[key];
    }
  }
  return result;
}