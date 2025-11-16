import { createContext, useState, useContext } from 'react'
import { postService, categoryService } from '../services/api'

const PostContext = createContext()

export const usePost = () => {
  const context = useContext(PostContext)
  if (!context) {
    throw new Error('usePost must be used within PostProvider')
  }
  return context
}

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchPosts = async (page = 1, limit = 10, category = null) => {
    setLoading(true)
    setError(null)
    try {
      const data = await postService.getAllPosts(page, limit, category)
      setPosts(data.data)
      return data
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch posts')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAllCategories()
      setCategories(data.data)
      return data
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch categories')
      throw err
    }
  }

  const createPost = async (postData) => {
    setLoading(true)
    setError(null)
    try {
      const data = await postService.createPost(postData)
      setPosts([data.data, ...posts])
      return data
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create post')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updatePost = async (id, postData) => {
    setLoading(true)
    setError(null)
    try {
      const data = await postService.updatePost(id, postData)
      setPosts(posts.map((post) => (post._id === id ? data.data : post)))
      return data
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update post')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deletePost = async (id) => {
    setLoading(true)
    setError(null)
    try {
      await postService.deletePost(id)
      setPosts(posts.filter((post) => post._id !== id))
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete post')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const value = {
    posts,
    categories,
    loading,
    error,
    fetchPosts,
    fetchCategories,
    createPost,
    updatePost,
    deletePost,
  }

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>
}
