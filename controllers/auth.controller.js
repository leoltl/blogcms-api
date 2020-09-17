const createError = require('http-errors');
const { validPassword, signJWToken } = require('../bin/utils');

module.exports = function makeController(User) {
  async function sign_in(req, res, next) {
    console.log(req.body)
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user || !validPassword(req.body.password, user.password_hash, user.salt)) {
        return next(createError(401, 'Invalid user credentials, please check and try again.'));
      }
      const token = signJWToken(user.id);
      res.json({ token });
    } catch (e) {
      next(e)
    }
  }

  function refresh(req, res) {
    // this route should passed the passport authenticate method and 
    // been attached a valid user from jwt subject claim
    const token = signJWToken(req.user.id);
    res.json({ token });
  }

  return {
    sign_in,
    refresh,
  }
}
