import { Link } from 'react-router-dom'
import './PostCard.css'

const PostCard = ({ post }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="post-card">
      {post.featuredImage && (
        <div className="post-card-image">
          <img
            src={`http://localhost:5000/uploads/${post.featuredImage}`}
            alt={post.title}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x200?text=No+Image'
            }}
          />
        </div>
      )}
      <div className="post-card-content">
        <div className="post-card-meta">
          {post.category && (
            <span
              className="post-category"
              style={{ backgroundColor: post.category.color }}
            >
              {post.category.name}
            </span>
          )}
          <span className="post-date">{formatDate(post.createdAt)}</span>
        </div>
        <h2 className="post-card-title">
          <Link to={`/posts/${post._id}`}>{post.title}</Link>
        </h2>
        {post.excerpt && <p className="post-card-excerpt">{post.excerpt}</p>}
        <div className="post-card-footer">
          <div className="post-author">
            By {post.author?.name || 'Anonymous'}
          </div>
          <div className="post-stats">
            <span>👁 {post.viewCount || 0}</span>
            <span>💬 {post.comments?.length || 0}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostCard
