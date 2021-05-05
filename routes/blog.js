const router = require('express').Router();
const Blog = require('../model/blog');
const Comment = require('../model/comments');

//Get all posts
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.render('home', { blogs });
  } catch (err) {
    const error_msg = 'Failed to load posts';
    res.status(500).render('error', { error_msg });
  }
});

// Get post by id
router.get('/blog/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id).populate('comments');
    res.render('blog', { blog });
  } catch (err) {
    const error_msg = 'Post not found';
    res.status(404).render('error', { error_msg });
  }
});

router.get('/create', (req, res) => {
  res.render('create');
});

//create new blog post
router.post('/', async (req, res) => {
  try {
    await Blog.create(req.body);
    req.flash('success', 'Post Created Successfully');
  } catch (err) {
    req.flash('error', 'Failed to create new post');
  }
  res.redirect('/');
});

//Render update page
router.get('/update/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  res.render('update', { blog });
});

//Delete post by id
router.delete('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    const comments = blog.comments;
    await Comment.deleteMany({ _id: { $in: comments } });
    await Blog.findByIdAndDelete(req.params.id);
    req.flash('success', 'Post Deleted Successfully');
  } catch (err) {
    req.flash('error', 'Failed to delete the post');
  }
  res.redirect('/');
});

//Update post by id
router.put('/:id', async (req, res) => {
  try {
    await Blog.findByIdAndUpdate(req.params.id, req.body);
    req.flash('success', 'Post Updated Successfully');
  } catch (err) {
    req.flash('error', 'Failed to update the post');
  }
  res.redirect(`/blog/${req.params.id}`);
});

//Comment on post
router.post('/blog/:id/comment', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    const newComment = new Comment(req.body);
    await newComment.save();
    blog.comments.unshift(newComment);
    await blog.save();
  } catch (err) {
    req.flash('error', 'Failed to add comment');
  }
  res.redirect(`/blog/${req.params.id}`);
});

module.exports = router;
