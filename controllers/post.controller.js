module.exports = function makeController(Post) {
  async function list(req, res, next) {
    try {
      const posts = await Post.find({});
      res.json(posts);
    } catch (e) {
      next(e);
    }
  }

  async function detail(req, res, next) {
    try {
      const post = await Post.find({ _id: req.params.id });
      res.json(post);
    } catch (e) {
      next(e);
    }
  }

  async function create(req, res, next) {
    try {
      const newPost = new Post({
        title: req.body.title,
        body: req.body.body,
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
      const updatePost = {
        title: req.body.title,
        body: req.body.body,
        author: req.user._id,
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
