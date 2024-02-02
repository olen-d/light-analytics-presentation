'use strict'

import { useState, useEffect } from 'react'

const useFetch = (url, method = 'GET', body = false) => {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestOptions = {}

        switch(method) {
          case 'GET':
            requestOptions.method = 'GET'
            break
          case 'PUT':
            requestOptions.method = 'PUT'
            requestOptions.headers['Content-Type'] = 'application/json'
            requestOptions.body = JSON.stringify(body)
            break;
        }

        const response = await fetch(url, requestOptions)
        const result = await response.json()
        setData(result)
      } catch (error) {
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  },
  [url, method, body])

  return {
    data,
    isLoading,
    error
  }
}

export default useFetch
