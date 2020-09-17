const { makeDataObjWithValidProps } = require('../bin/utils');

module.exports = function makeController(Post) {
  async function list(req, res, next) {
    try {
      const query = { published: true }
      if (req.user) {
        query.published = false
      }
      const posts = await Post.find(query);
      res.json(posts);
    } catch (e) {
      next(e);
    }
  }

  async function detail(req, res, next) {
    try {
      const query = { _id: req.params.id, published: true }
      if (req.user) {
        query.published = false
      }
      const post = await Post.findOne(query);
      res.json(post);
    } catch (e) {
      next(e);
    }
  }

  async function create(req, res, next) {
    try {
      const post = makeDataObjWithValidProps(req.body, Post.schema.tree);
      const newPost = new Post({
        ...post,
        author: req.user._id,
      });
      await newPost.save();
      res.json(newPost);
    } catch (e) {
      next(e);
    }
  }

  async function update(req, res, next) {
    try {
      const { id } = req.params;
      const updates = makeDataObjWithValidProps(req.body, Post.schema.tree);
      const updatePost = {
        ...updates,
        author: req.user._id,
        updated_at: Date.now(),
      };
      const post = await Post.findOneAndUpdate({ _id: id }, updatePost, { new: true });
      res.json(post);
    } catch (e) {
      next(e);
    }
  }

  return {
    list,
    detail,
    create,
    update,
  }
}
