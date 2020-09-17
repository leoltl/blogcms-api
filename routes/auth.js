const express = require('express');

module.exports = function makeRoutes(authController, passport) {
  const router = express.Router();
  
  router.post('/sign-in', authController.sign_in);

  router.post('/refresh', passport.authenticate('jwt', { session: false }), authController.refresh);

  return router;
}
