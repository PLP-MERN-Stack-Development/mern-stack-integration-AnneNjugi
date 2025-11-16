# MERN Stack Blog Application

A full-stack blog application built with MongoDB, Express.js, React.js, and Node.js.

## Features

### Backend
- RESTful API with Express.js
- MongoDB database with Mongoose ODM
- JWT authentication
- User registration and login
- Role-based authorization (user/admin)
- Input validation with express-validator
- Image upload with Multer
- Comment system
- Search and filtering
- Pagination support

### Frontend
- React 18 with Hooks
- React Router for navigation
- Context API for state management
- Responsive design
- User authentication flow
- CRUD operations for posts
- Comment functionality
- Category filtering
- Clean and modern UI

## Project Structure

```
mern-blog/
├── server/              # Backend
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   ├── uploads/        # Uploaded images
│   └── server.js       # Entry point
└── client/             # Frontend
    └── src/
        ├── components/ # Reusable components
        ├── pages/      # Page components
        ├── context/    # Context providers
        ├── services/   # API services
        └── hooks/      # Custom hooks
```

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally or MongoDB Atlas)

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/mern-blog
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

5. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

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
- `POST /api/categories` - Create category (admin only)

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- express-validator
- Multer
- CORS

### Frontend
- React 18
- React Router DOM
- Axios
- Vite
- CSS3

## Features Implemented

✅ User authentication (register/login)
✅ Protected routes
✅ Create, read, update, delete posts
✅ Comment system
✅ Category management
✅ Image uploads
✅ Search functionality
✅ Pagination
✅ Input validation
✅ Error handling
✅ Responsive design

## License

MIT
