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
