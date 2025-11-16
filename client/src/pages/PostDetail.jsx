import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { postService } from '../services/api'
import { useAuth } from '../context/AuthContext'
import './PostDetail.css'

const PostDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchPost()
  }, [id])

  const fetchPost = async () => {
    try {
      const data = await postService.getPost(id)
      setPost(data.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load post')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postService.deletePost(id)
        navigate('/')
      } catch (err) {
        alert('Failed to delete post')
      }
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!comment.trim()) return

    setSubmitting(true)
    try {
      await postService.addComment(id, { content: comment })
      setComment('')
      fetchPost()
    } catch (err) {
      alert('Failed to add comment')
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) return <div className="loading">Loading post...</div>
  if (error) return <div className="error">{error}</div>
  if (!post) return <div className="error">Post not found</div>

  const isAuthor = user && post.author && user.id === post.author._id

  return (
    <div className="post-detail">
      <article className="post-content">
        {post.category && (
          <span
            className="post-category-badge"
            style={{ backgroundColor: post.category.color }}
          >
            {post.category.name}
          </span>
        )}
        <h1>{post.title}</h1>
        <div className="post-meta">
          <span>By {post.author?.name || 'Anonymous'}</span>
          <span>•</span>
          <span>{formatDate(post.createdAt)}</span>
          <span>•</span>
          <span>👁 {post.viewCount} views</span>
        </div>

        {isAuthor && (
          <div className="post-actions">
            <Link to={`/edit/${post._id}`} className="btn btn-secondary">
              Edit
            </Link>
            <button onClick={handleDelete} className="btn btn-danger">
              Delete
            </button>
          </div>
        )}

        <div className="post-body">
          <p>{post.content}</p>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="post-tags">
            {post.tags.map((tag, index) => (
              <span key={index} className="tag">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>

      <section className="comments-section">
        <h2>Comments ({post.comments?.length || 0})</h2>

        {isAuthenticated ? (
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              rows={3}
              required
            />
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        ) : (
          <p className="login-prompt">
            <Link to="/login">Login</Link> to leave a comment
          </p>
        )}

        <div className="comments-list">
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment) => (
              <div key={comment._id} className="comment">
                <div className="comment-author">{comment.user?.name || 'Anonymous'}</div>
                <div className="comment-content">{comment.content}</div>
                <div className="comment-date">{formatDate(comment.createdAt)}</div>
              </div>
            ))
          ) : (
            <p className="no-comments">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </section>
    </div>
  )
}

export default PostDetail
