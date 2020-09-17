const express = require('express');

module.exports = function makeRoutes(postController, passport) {
  const router = express.Router();

  router.get('/:id', postController.detail);
  router.get('/', postController.list);

  // require authentication for post put delete
  router.use(passport.authenticate('jwt', { session: false }));

  router.post('/', postController.create);
  router.put('/:id', postController.update);

  return router;
}
