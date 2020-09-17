const express = require('express');

module.exports = function makeRoutes(postController) {
  const router = express.Router();

  router.get('/:id', postController.detail);
  router.get('/', postController.list);

  router.post('/', postController.create);
  router.put('/:id', postController.update);

  return router;
}
