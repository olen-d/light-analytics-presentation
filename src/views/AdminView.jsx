'use strict'

import { useEffect, useState } from 'react'

import ChartColumn from '../components/ChartColumn'
import ChartPie from '../components/ChartPie'
import DisplayStatisticNumber from '../components/DisplayStatisticNumber'
import LayoutChart from '../components/LayoutChart'

import { Unstable_Grid2 as Grid } from '@mui/material'

const mockPie = [
  {
      "route": "/about",
      "total_time": "89861",
      "total_views": 2
  },
  {
      "route": "/courses/jarrett-creek-loop",
      "total_time": "42256",
      "total_views": 1
  },
  {
      "route": "/courses/gravel-gambler-intermediate",
      "total_time": "37293",
      "total_views": 1
  },
  {
      "route": "/",
      "total_time": "23107",
      "total_views": 2
  }
]

const AdminView = () => {
  const apiKeyRead = import.meta.env.VITE_ANALYTICS_API_KEY_READ
  const baseAnalyticsApiUrl = import.meta.env.VITE_ANALYTICS_API_BASE_URL

  const [bounceRate, setBounceRate] = useState(0)
  const [startDateViews, setStartDateViews] = useState(null)
  const [endDateViews, setEndDateViews] = useState(null)
  const [totalSinglePageSessions, setTotalSinglePageSessions] = useState(0)
  const [totalTimeByRouteFormatted, setTotalTimeByRouteFormatted] = useState([])
  const [totalViewsByRouteFormatted, setTotalViewsByRouteFormatted] = useState([])
  const [totalTimeViewsByRoute, setTotalTimeViewsByRoute] = useState([])
  const [totalTimeViewsByRouteFiltered, setTotalTimeViewsByRouteFiltered] = useState([])
  const [totalViewsByDay, setTotalViewsByDay] = useState([])
  const [totalViewsByDayFormatted, setTotalViewsByDayFormatted] = useState([])
  const [totalVisits, setTotalVisits] = useState(0)
  const [totalVisitsByDay, setTotalVisitsByDay] = useState([])
  const [totalVisitsByDayFormatted, setTotalVisitsByDayFormatted] = useState([])
  const [uniqueVisits, setUniqueVisits] = useState(0)

  // Utility Functions
  const formatDateJs = date => {
    const dayJs = date.getDate()
    const monthJs = date.getMonth() + 1
    const day = dayJs.toString().padStart(2, '0')
    const month = monthJs.toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${year}-${month}-${day}`
  }

  const formatDateHuman = (date, options) => {
    const dateTimeFormatHuman = new Intl.DateTimeFormat('en-US', options).format(date)
    return dateTimeFormatHuman
  }

  const formatSlug = slug => {
    return slug
      .toLowerCase()
      .split('-')
      .map(item => {
        return item[0].toUpperCase() + item.substr(1)
      })
      .join(' ')
  }

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
        
        const endDate = formatDateJs(endDateJs)
        const startDate = formatDateJs(startDateJs)

        const response = await fetch(`${baseAnalyticsApiUrl}/api/v1/pages/by-day?startdate=${startDate}&enddate=${endDate}`, requestOptions)
        const result = await response.json()
        
        if(result.status === 'ok') {
          const { data: { totalViewsByDay: tvbd }, } = result
          setTotalViewsByDay(tvbd)

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
          setTotalViewsByDayFormatted(formattedDates)
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  }, [])

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
        
        const endDate = formatDateJs(endDateJs)
        const startDate = formatDateJs(startDateJs)

        const response = await fetch(`${baseAnalyticsApiUrl}/api/v1/pages/routes/total-time-views?startdate=${startDate}&enddate=${endDate}`, requestOptions)
        const result = await response.json()
        
        if(result.status === 'ok') {
          const dateOptions = {
            month: 'long',
            day: 'numeric'
          }

          setStartDateViews(formatDateHuman(startDateJs, dateOptions))
          setEndDateViews(formatDateHuman(endDateJs, dateOptions))

          const exceededFormatted = values => {
            const categories = values.slice(0,4)
            const others = values.slice(4)

            const otherTotal = others.reduce((sum, { value }) => sum + value, 0)
            categories.push({ dataLabel: 'Other', value: otherTotal})

            return categories
          }
  
          const { data: ttvbr } = result
          setTotalTimeViewsByRoute(ttvbr)

          const filteredTotalTimeViewsByRoute = ttvbr.filter(item => {
            const { route } = item
            return route.includes('/courses/')
          })

          const sortedTotalViewsByRoute = filteredTotalTimeViewsByRoute.toSorted((a, b) => {
            return b.total_views - a.total_views
          })

          const sortedTotalTimeByRoute = filteredTotalTimeViewsByRoute.toSorted((a, b) => {
            return b.total_time - a.total_time
          })

          const totalViewsByRoute = sortedTotalViewsByRoute.map(item => {
            const { route, 'total_views': value } = item
            const routeSlug = route.split('/').pop()
            const dataLabel = formatSlug(routeSlug)
            return({ dataLabel, value })
          })

          const totalTimeByRoute = sortedTotalTimeByRoute.map(item => {
            const { route, 'total_time': value } = item
            const routeSlug = route.split('/').pop()
            const dataLabel = formatSlug(routeSlug)
            return({ dataLabel, value })
          })
      
          const totalViewsByRouteFinal = totalViewsByRoute.length > 5 ? exceededFormatted(totalViewsByRoute) : totalViewsByRoute
          const totalTimeByRouteFinal = totalTimeByRoute.length > 5 ? exceededFormatted(totalTimeByRoute) : totalTimeByRoute

          setTotalViewsByRouteFormatted(totalViewsByRouteFinal)
          setTotalTimeByRouteFormatted(totalTimeByRouteFinal)
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async ()=> {
      try {
        const requestOptions = {
          method: 'GET',
          headers: {
            'api-key': apiKeyRead
          }
        }
          const response = await fetch(`${baseAnalyticsApiUrl}/api/v1/sessions/bounce-rate`, requestOptions)
          const result = await response.json()

          if (result.status === 'ok') {
            const { data: { bounceRate: br }, } = result
            setBounceRate(br)
          }
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async ()=> {
      try {
        const requestOptions = {
          method: 'GET',
          headers: {
            'api-key': apiKeyRead
          }
        }
          const response = await fetch(`${baseAnalyticsApiUrl}/api/v1/sessions/unique`, requestOptions)
          const result = await response.json()

          if (result.status === 'ok') {
            const { data: { uniqueVisits: uv }, } = result
            setUniqueVisits(uv)
          }
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async ()=> {
      try {
        const requestOptions = {
          method: 'GET',
          headers: {
            'api-key': apiKeyRead
          }
        }
          const response = await fetch(`${baseAnalyticsApiUrl}/api/v1/sessions`, requestOptions)
          const result = await response.json()

          if (result.status === 'ok') {
            const { data: { totalVisits: tv }, } = result
            setTotalVisits(tv)
          }
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async ()=> {
      try {
        const requestOptions = {
          method: 'GET',
          headers: {
            'api-key': apiKeyRead
          }
        }
          const response = await fetch(`${baseAnalyticsApiUrl}/api/v1/sessions/single-page`, requestOptions)
          const result = await response.json()

          if (result.status === 'ok') {
            const { data: { totalSinglePageSessions: tsps }, } = result
            setTotalSinglePageSessions(tsps)
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
      <div>
        <ChartColumn
          categoryName='Dates'
          categoryKey='day'
          chartData={totalViewsByDayFormatted}
          seriesName='Page Views'
          startFromValue={0}
        />
      </div>
      <div>
        <LayoutChart
          chart={ChartPie}
          chartColors={['#94fa70', '#00cd9c', '#0095a4', '#006291', '#292f56']}
          chartData={totalViewsByRouteFormatted}
          startAngle={-90}
          subtitle={`${startDateViews} to ${endDateViews}`}
          source="No Car Gravel"
          title="Courses by Page Views"
        />
      </div>
      <div>
        <LayoutChart
          chart={ChartPie}
          chartColors={['#94fa70', '#00cd9c', '#0095a4', '#006291', '#292f56']}
          chartData={totalTimeByRouteFormatted}
          startAngle={-90}
          subtitle={`${startDateViews} to ${endDateViews}`}
          source="No Car Gravel"
          title="Courses by Viewing Time"
        />
      </div>
      <Grid container spacing={2}>
        <Grid xs={6} md={4} xl={3}>
          <div>
            <DisplayStatisticNumber
              statisticName='Total Visits'
              statisticValue={totalVisits}
            />
          </div>
        </Grid>
        <Grid xs={6} md={4} xl={3}>
          <div>
            <DisplayStatisticNumber
              statisticName='Unique Visits'
              statisticValue={uniqueVisits}
            />
          </div>
        </Grid>
        <Grid xs={6} md={4} xl={3}>
          <div>
            <DisplayStatisticNumber
              statisticName='Single Page Sessions'
              statisticValue={totalSinglePageSessions}
            />
          </div>
        </Grid>
        <Grid xs={6} md={4} xl={3}>
          <div>
            <DisplayStatisticNumber
              format='percent'
              statisticName='Bounce Rate'
              statisticValue={bounceRate}
            />
          </div>
        </Grid>
      </Grid>
    </>
  )
}

export default AdminView
