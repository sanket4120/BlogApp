const router = require('express').Router();
const Blog = require('../model/blog');
const Comment = require('../model/comments');

router.get('/', async (req, res) => {
  const blogs = await Blog.find();
  res.render('home', { blogs });
});

router.get('/blog/:id', async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById(id).populate('comments');
  res.render('blog', { blog });
});

router.get('/create', (req, res) => {
  res.render('create');
});

router.post('/', async (req, res) => {
  await Blog.create(req.body);
  res.redirect('/');
});

router.get('/update/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  res.render('update', { blog });
});

router.delete('/:id', async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

router.put('/:id', async (req, res) => {
  await Blog.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/');
});

router.post('/blog/:id/comment', async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  const newComment = new Comment(req.body);
  await newComment.save();
  blog.comments.unshift(newComment);
  await blog.save();
  res.redirect(`/blog/${req.params.id}`);
});

module.exports = router;
