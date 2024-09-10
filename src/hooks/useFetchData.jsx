import { useState, useEffect } from 'react'

/*
  requestConfig = {
    apiKey,
    method,
    url
  }
*/

const useFetchData = (requestConfig) => {
  const _requestConfig = requestConfig || {}

  const [fetchResult, setFetchResult] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const requestOptions = {}

    if (_requestConfig?.apiKey) {
      requestOptions.headers = { 'api-key': _requestConfig.apiKey }
    }
  
    switch(_requestConfig?.method) {
      case 'GET':
        requestOptions.method = 'GET'
        break
      case 'PUT':
        requestOptions.method = 'PUT'
        requestOptions.headers['Content-Type'] = 'application/json'
        requestOptions.body = JSON.stringify(body)
        break
    }

    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(_requestConfig.url, requestOptions)
        const result = await response.json()
        setFetchResult(result)
      } catch (error) {
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [requestConfig.apiKey, requestConfig.method, requestConfig.url])

  return {
    fetchResult,
    isLoading,
    error
  }
}

export default useFetchData
