const express = require('express');

module.exports = function makeRoutes(commentController) {
  const router = express.Router();
  router.get('/', commentController.list);
  router.put('/:id', commentController.update);
  return router;
}
