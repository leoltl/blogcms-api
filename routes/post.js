const express = require('express');

module.exports = function makeRoutes(postController, commentController, passport) {
  const router = express.Router();
  
  router.post('/:id/comment', commentController.create);

  router.use(passport.optionalAuthenticate('jwt', { session: false }));
  router.get('/:id', postController.detail);
  router.get('/', postController.list);
  
  router.use(passport.authenticate('jwt', { session: false }));
  router.post('/', postController.create);
  router.put('/:id', postController.update);

  return router;
}
