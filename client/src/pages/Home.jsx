import { useEffect, useState } from 'react'
import { usePost } from '../context/PostContext'
import PostCard from '../components/PostCard/PostCard'
import './Home.css'

const Home = () => {
  const { posts, loading, error, fetchPosts, fetchCategories, categories } = usePost()
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchPosts()
    fetchCategories()
  }, [])

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId)
    fetchPosts(1, 10, categoryId)
  }

  if (loading) return <div className="loading">Loading posts...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="home">
      <div className="home-header">
        <h1>Latest Blog Posts</h1>
        <p>Discover amazing stories and insights</p>
      </div>

      <div className="filters">
        <button
          className={`filter-btn ${!selectedCategory ? 'active' : ''}`}
          onClick={() => handleCategoryFilter(null)}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            className={`filter-btn ${selectedCategory === cat._id ? 'active' : ''}`}
            onClick={() => handleCategoryFilter(cat._id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="posts-grid">
        {posts.length === 0 ? (
          <p className="no-posts">No posts found. Be the first to create one!</p>
        ) : (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        )}
      </div>
    </div>
  )
}

export default Home
