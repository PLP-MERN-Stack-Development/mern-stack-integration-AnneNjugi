import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { postService } from '../services/api'
import { usePost } from '../context/PostContext'
import PostForm from '../components/PostForm/PostForm'
import './EditPost.css'

const EditPost = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { updatePost } = usePost()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPost()
  }, [id])

  const fetchPost = async () => {
    try {
      const data = await postService.getPost(id)
      const postData = data.data
      setPost({
        title: postData.title,
        content: postData.content,
        excerpt: postData.excerpt || '',
        category: postData.category._id,
        tags: postData.tags ? postData.tags.join(', ') : '',
        isPublished: postData.isPublished,
      })
    } catch (err) {
      alert('Failed to load post')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (postData) => {
    try {
      await updatePost(id, postData)
      navigate(`/posts/${id}`)
    } catch (err) {
      throw err
    }
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="edit-post">
      <h1>Edit Post</h1>
      {post && <PostForm initialData={post} onSubmit={handleSubmit} submitLabel="Update Post" />}
    </div>
  )
}

export default EditPost
