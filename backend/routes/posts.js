const express = require('express'),
      router = express.Router(),
      Post = require('../models/post'),
      auth = require('../middleware/auth'),
      imageUpload = require('../middleware/imageUpload');

const notFoundMsg = 'Post not found';

router.get('/', async (req, res) => {
  const { page, pageSize } = req.query;

  const posts = await Post.find()
    .skip((+page - 1) * +pageSize)
    .limit(+pageSize)
    .populate('user', 'email')
    .select({ __v: 0 });

  const count = await Post.countDocuments();

  res.send({ posts, count });
});

router.get('/:id', async (req, res) => {
  const post = await Post
    .findById(req.params.id)
    .populate('user', 'email')
    .select({ __v: 0 });

  if ( !post ) return res.status(404).send(notFoundMsg);

  res.send(post);
});

router.post('/', [auth, imageUpload], async (req, res) => {
  const url = `${req.protocol}://${req.get('host')}`
  const filename = req.file.filename;

  const { title, content } = req.body;

  const post = new Post({
    title,
    content,
    imagePath: `${url}/images/${filename}`,
    user: req.user._id
  });

  await post.save();

  res.send(post);
});

router.put('/:id', [auth, imageUpload], async (req, res) => {
  let imagePath = req.body.imagePath;

  if ( req.file ) {
    const url = `${req.protocol}://${req.get('host')}`
    const filename = req.file.filename;

    imagePath = `${url}/images/${filename}`
  }

  const { id } = req.params;
  const { title, content } = req.body;

  let post = await Post.findOne({ _id: id, user: req.user._id });

  if ( !post ) return res.status(403).send('You may not edit a post you did not create.');

  post = await Post
    .findOneAndUpdate(id, {
      title,
      content,
      imagePath
    }, { new: true })
    .select({ __v: 0 });

  if ( !post ) return res.status(404).send(notFoundMsg);

  res.send(post);
});

router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;

  let post = await Post.findOne({ _id: id, user: req.user._id });

  if ( !post ) return res.status(403).send('You may not delete a post you did not create.');

  post = await Post.findOneAndDelete(id);

  if ( !post ) return res.status(404).send(notFoundMsg);

  res.send(post);
});

module.exports = router;