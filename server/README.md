# MERN Blog - Backend Server

Backend API for the MERN Blog application built with Node.js, Express, and MongoDB.

## Features

- RESTful API for blog posts and categories
- User authentication with JWT
- Image upload for featured images
- Input validation with express-validator
- MongoDB database with Mongoose ODM
- Comment system for blog posts
- Search and filtering functionality
- Pagination support

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Posts
- `GET /api/posts` - Get all posts (with pagination)
- `GET /api/posts/search?q=query` - Search posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post (protected)
- `PUT /api/posts/:id` - Update post (protected)
- `DELETE /api/posts/:id` - Delete post (protected)
- `POST /api/posts/:id/comments` - Add comment (protected)
- `POST /api/posts/upload` - Upload image (protected)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update environment variables in `.env`

4. Start the server:
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

## Environment Variables

See `.env.example` for required environment variables.
