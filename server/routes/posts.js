// posts.js - Post routes

const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  validatePost,
  validateComment,
  validateMongoId,
  handleValidationErrors,
} = require('../middleware/validation');

// @route   GET /api/posts
// @desc    Get all posts with pagination and filtering
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Build query
    const query = { isPublished: true };
    
    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.author) {
      query.author = req.query.author;
    }

    // Get posts
    const posts = await Post.find(query)
      .populate('author', 'name email avatar')
      .populate('category', 'name slug color')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count
    const total = await Post.countDocuments(query);

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: posts,
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/posts/search
// @desc    Search posts
// @access  Public
router.get('/search', async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required',
      });
    }

    const posts = await Post.find({
      isPublished: true,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } },
      ],
    })
      .populate('author', 'name email avatar')
      .populate('category', 'name slug color')
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/posts/:id
// @desc    Get single post by ID or slug
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    let post;

    // Check if it's a MongoDB ID or slug
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      post = await Post.findById(req.params.id)
        .populate('author', 'name email avatar bio')
        .populate('category', 'name slug color')
        .populate('comments.user', 'name avatar');
    } else {
      post = await Post.findOne({ slug: req.params.id })
        .populate('author', 'name email avatar bio')
        .populate('category', 'name slug color')
        .populate('comments.user', 'name avatar');
    }

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    // Increment view count
    await post.incrementViewCount();

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post(
  '/',
  protect,
  validatePost,
  handleValidationErrors,
  async (req, res, next) => {
    try {
      // Add author to post data
      req.body.author = req.user.id;

      const post = await Post.create(req.body);

      // Populate author and category
      await post.populate('author', 'name email avatar');
      await post.populate('category', 'name slug color');

      res.status(201).json({
        success: true,
        data: post,
      });
    } catch (err) {
      next(err);
    }
  }
);

// @route   PUT /api/posts/:id
// @desc    Update a post
// @access  Private
router.put(
  '/:id',
  protect,
  validateMongoId,
  validatePost,
  handleValidationErrors,
  async (req, res, next) => {
    try {
      let post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({
          success: false,
          error: 'Post not found',
        });
      }

      // Check if user is post owner or admin
      if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to update this post',
        });
      }

      post = await Post.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      })
        .populate('author', 'name email avatar')
        .populate('category', 'name slug color');

      res.status(200).json({
        success: true,
        data: post,
      });
    } catch (err) {
      next(err);
    }
  }
);

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete(
  '/:id',
  protect,
  validateMongoId,
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({
          success: false,
          error: 'Post not found',
        });
      }

      // Check if user is post owner or admin
      if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to delete this post',
        });
      }

      await post.deleteOne();

      res.status(200).json({
        success: true,
        data: {},
      });
    } catch (err) {
      next(err);
    }
  }
);

// @route   POST /api/posts/:id/comments
// @desc    Add a comment to a post
// @access  Private
router.post(
  '/:id/comments',
  protect,
  validateMongoId,
  validateComment,
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({
          success: false,
          error: 'Post not found',
        });
      }

      await post.addComment(req.user.id, req.body.content);

      // Populate the comments
      await post.populate('comments.user', 'name avatar');

      res.status(201).json({
        success: true,
        data: post,
      });
    } catch (err) {
      next(err);
    }
  }
);

// @route   POST /api/posts/upload
// @desc    Upload featured image for post
// @access  Private
router.post('/upload', protect, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload an image file',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
