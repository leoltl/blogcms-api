const express = require('express');

module.exports = function makeRoutes(postController, passport) {
  const router = express.Router();

  router.use(passport.optionalAuthenticate('jwt', { session: false }));
  router.get('/:id', postController.detail);
  router.get('/', postController.list);
  
  router.use(passport.authenticate('jwt', { session: false }));
  router.post('/', postController.create);
  router.put('/:id', postController.update);

  return router;
}
