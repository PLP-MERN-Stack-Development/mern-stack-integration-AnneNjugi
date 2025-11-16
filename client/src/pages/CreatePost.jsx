import { useNavigate } from 'react-router-dom'
import { usePost } from '../context/PostContext'
import PostForm from '../components/PostForm/PostForm'
import './CreatePost.css'

const CreatePost = () => {
  const navigate = useNavigate()
  const { createPost } = usePost()

  const handleSubmit = async (postData) => {
    try {
      await createPost(postData)
      navigate('/')
    } catch (err) {
      throw err
    }
  }

  return (
    <div className="create-post">
      <h1>Create New Post</h1>
      <PostForm onSubmit={handleSubmit} submitLabel="Create Post" />
    </div>
  )
}

export default CreatePost
