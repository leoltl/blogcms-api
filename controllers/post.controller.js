const { makeDataObjWithValidProps } = require('../bin/utils');

module.exports = function makeController(Post) {
  async function list(req, res, next) {
    try {
      const query = { published: true }
      if (req.user) {
        delete query.published
      }
      const posts = await Post.find(query, null, { sort: {created_at: 'desc'} }).populate('author', 'username').populate({ path: 'comments', match: { published: true }});
      res.json(posts);
    } catch (e) {
      next(e);
    }
  }

  async function detail(req, res, next) {
    try {
      const query = { _id: req.params.id, published: true }
      if (req.user) {
        delete query.published
      }
      const post = await Post.findOne(query, null, { sort: {created_at: 'desc'} }).populate('author', 'username').populate({ path: 'comments', match: { published: true }});
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
      await newPost.populate('author', 'username').populate({ path: 'comments', match: { published: true }}).execPopulate()
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
      const post = await Post.findOneAndUpdate({ _id: id }, updatePost, { new: true }).populate('author', 'username').populate({ path: 'comments', match: { published: true }});
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
