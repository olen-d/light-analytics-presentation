'use strict'

import { useEffect, useState } from 'react'

import ChartColumn from '../components/ChartColumn'

const AdminView = () => {
  const apiKeyRead = import.meta.env.VITE_ANALYTICS_API_KEY_READ
  const baseAnalyticsApiUrl = import.meta.env.VITE_ANALYTICS_API_BASE_URL

  const [totalVisitsByDay, setTotalVisitsByDay] = useState([])
  const [totalVisitsByDayFormatted, setTotalVisitsByDayFormatted] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const requestOptions = {
        method: 'GET',
        headers: {
          'api-key': apiKeyRead
        }
      }
  
      try {
        const endDateJs = new Date()
        const startDateJs = new Date()
        startDateJs.setDate(startDateJs.getDate() - 6)
        
        const formatDateJs = date => {
          const dayJs = date.getDate()
          const monthJs = date.getMonth() + 1
          const day = dayJs.toString().padStart(2, '0')
          const month = monthJs.toString().padStart(2, '0')
          const year = date.getFullYear()
          return `${year}-${month}-${day}`
        }

        const endDate = formatDateJs(endDateJs)
        const startDate = formatDateJs(startDateJs)

        const response = await fetch(`${baseAnalyticsApiUrl}/api/v1/sessions/by-day?startdate=${startDate}&enddate=${endDate}`, requestOptions)
        const result = await response.json()
        
        if(result.status === 'ok') {
          const { data: { totalVisitsByDay: tvbd }, } = result
          setTotalVisitsByDay(tvbd)

          const datesInPeriod = []

          for(let i=0; i < 7; i++) {
            const lastJs = new Date(startDateJs)
            lastJs.setDate(lastJs.getDate() + i)
            const last = formatDateJs(lastJs)
            datesInPeriod.push(last)
          }

          const totalVisitsWithZeros = datesInPeriod.map(item => {
            const index = tvbd.findIndex(d => d.day === item)
            return index === -1 ? { day: item, count: 0} : tvbd[index]
          })

          const formattedDates = totalVisitsWithZeros.map(item => {
            const { day, count } = item
            const dayParts = day.split('-')
            const jsDate = new Date(dayParts[0], dayParts[1] -1, dayParts[2])

            const options = { weekday: 'short' }
            const dateTimeFormat = new Intl.DateTimeFormat('en-US', options)
            const dateFormatted = dateTimeFormat.format(jsDate)
            return { day: dateFormatted, count }
          })
          setTotalVisitsByDayFormatted(formattedDates)
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  }, [])

  return(
    <>
      <h1 className="site-lead extended">Administration</h1>
      <div>
        <ChartColumn
          categoryName='Dates'
          categoryKey='day'
          chartData={totalVisitsByDayFormatted}
          seriesName='Visits'
          startFromValue={0}
        />
      </div>
    </>
  )
}

export default AdminView
