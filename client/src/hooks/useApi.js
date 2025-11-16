import { useState, useEffect } from 'react'

export const useApi = (apiFunc, immediate = true) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = async (...params) => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiFunc(...params)
      setData(result)
      return result
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'An error occurred')
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [])

  return { data, loading, error, execute }
}
