import express from 'express';
import Post from '../models/Post.js';
import User from '../models/User.js';
import { verifyToken } from './auth.js';

const router = express.Router();

// Get all posts (with filters)
router.get('/', async (req, res) => {
  try {
    const { temple, type, page = 1, limit = 10 } = req.query;
    let query = { isPublic: true };
    
    if (temple) query.temple = temple;
    if (type) query.type = type;
    
    const posts = await Post.find(query)
      .populate('user', 'name spiritualName temple')
      .populate('temple', 'name city')
      .populate('comments.user', 'name spiritualName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Post.countDocuments(query);
    
    res.json({
      success: true,
      count,
      posts,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'name spiritualName temple')
      .populate('temple', 'name city')
      .populate('comments.user', 'name spiritualName');
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    res.json({ success: true, post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new post
router.post('/', verifyToken, async (req, res) => {
  try {
    const { content, images, type, temple, tags } = req.body;
    
    const post = new Post({
      user: req.user.id,
      content,
      images: images || [],
      type: type || 'update',
      temple,
      tags: tags || []
    });
    
    await post.save();
    
    await post.populate('user', 'name spiritualName');
    
    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update post
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    // Check ownership
    if (post.user.toString() !== req.user.id && req.user.userType !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    const updated = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Post updated successfully',
      post: updated
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete post
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    if (post.user.toString() !== req.user.id && req.user.userType !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    await Post.findByIdAndDelete(req.params.id);
    
    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Like/Unlike post
router.post('/:id/like', verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    const userId = req.user.id;
    const index = post.likes.indexOf(userId);
    
    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(index, 1);
    }
    
    await post.save();
    
    res.json({
      success: true,
      likes: post.likes.length,
      isLiked: index === -1
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add comment
router.post('/:id/comments', verifyToken, async (req, res) => {
  try {
    const { content } = req.body;
    
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    post.comments.push({
      user: req.user.id,
      content
    });
    
    await post.save();
    
    await post.populate('comments.user', 'name spiritualName');
    
    res.json({
      success: true,
      message: 'Comment added',
      comments: post.comments
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get user's posts
router.get('/user/:userId', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const posts = await Post.find({ user: req.params.userId, isPublic: true })
      .populate('user', 'name spiritualName temple')
      .populate('temple', 'name city')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Post.countDocuments({ user: req.params.userId, isPublic: true });
    
    res.json({
      success: true,
      count,
      posts,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
