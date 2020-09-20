const { ObjectId } = require('mongoose').Types;
const { makeDataObjWithValidProps } = require('../bin/utils');

module.exports = function makeController(Post, Comment) {

  async function create(req, res, next) {
    try {
      const postId = req.params.id;
      const comment = makeDataObjWithValidProps(req.body, Comment.schema.tree);
      const newComment = new Comment({
        ...comment,
        post: new ObjectId(postId),
      });
      await newComment.save();
      await Post.updateOne({ _id: postId }, { $push: { comments: newComment } });
      res.json(newComment);
    } catch (e) {
      next(e);
    }
  }

  async function update(req, res, next) {
    try {
      const { id } = req.params;
      const updates = makeDataObjWithValidProps(req.body, Comment.schema.tree);
      const updateComments = {
        ...updates,
        updated_at: Date.now(),
      };
      const comment = await Comment.findOneAndUpdate({ _id: id }, updateComments, { new: true })
      res.json(comment);
    } catch (e) {
      next(e);
    }
  }

  return {
    create,
    update
  }
}
