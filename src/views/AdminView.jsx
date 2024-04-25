'use strict'

import { useEffect, useState } from 'react'

import ChartBar from '../components/ChartBar'
import ChartColumn from '../components/ChartColumn'
import ChartPie from '../components/ChartPie'
import DisplayStatisticNumber from '../components/DisplayStatisticNumber'
import LayoutChart from '../components/LayoutChart'

import { Unstable_Grid2 as Grid } from '@mui/material'

const AdminView = () => {
  const apiKeyRead = import.meta.env.VITE_ANALYTICS_API_KEY_READ
  const baseAnalyticsApiUrl = import.meta.env.VITE_ANALYTICS_API_BASE_URL

  const [bounceRate, setBounceRate] = useState(0)
  const [startDateEntryViews, setStartDateEntryViews] = useState(null)
  const [endDateEntryViews, setEndDateEntryViews] = useState(null)
  const [startDateViews, setStartDateViews] = useState(null)
  const [endDateViews, setEndDateViews] = useState(null)
  const [startDateVisits, setStartDateVisits] = useState(null)
  const [endDateVisits, setEndDateVisits] = useState(null)
  const [totalEntriesByRoute, setTotalEntriesByRoute] = useState([])
  const [totalEntriesByRouteFormatted, setTotalEntriesByRouteFormatted] = useState([])
  const [totalSinglePageSessions, setTotalSinglePageSessions] = useState(0)
  const [totalFilteredTimeByRouteFormatted, setTotalFilteredTimeByRouteFormatted] = useState([])
  const [totalFilteredViewsByRouteFormatted, setTotalFilteredViewsByRouteFormatted] = useState([])
  const [totalTimeByConsolidatedRouteFormatted, setTotalTimeByConsolidatedRouteFormatted] = useState([])
  const [totalTimeByDayFormatted, setTotalTimeByDayFormatted] = useState([])
  const [totalTimeByRouteFormatted, setTotalTimeByRouteFormatted] = useState([])
  const [totalTimeViewsByRoute, setTotalTimeViewsByRoute] = useState([])
  const [totalTimeViewsByRouteFiltered, setTotalTimeViewsByRouteFiltered] = useState([])
  const [totalViewsByConsolidatedRouteFormatted, setTotalViewsByConsolidatedRouteFormatted] = useState([])
  const [totalViewsByDay, setTotalViewsByDay] = useState([])
  const [totalViewsByDayFormatted, setTotalViewsByDayFormatted] = useState([])
  const [totalViewsByRouteFormatted, setTotalViewsByRouteFormatted] = useState([])
  const [totalVisits, setTotalVisits] = useState(0)
  const [totalVisitsByDay, setTotalVisitsByDay] = useState([])
  const [totalVisitsByDayFormatted, setTotalVisitsByDayFormatted] = useState([])
  const [uniqueVisits, setUniqueVisits] = useState(0)

  // Utility Functions
  const exceededFormatted = values => {
    const categories = values.slice(0,4)
    const others = values.slice(4)

    const otherTotal = others.reduce((sum, { value }) => sum + value, 0)
    categories.push({ dataLabel: 'Other', value: otherTotal})

    return categories
  }

  const exceededTruncated = (values, limit) => {
    return values.slice(0, limit)
  }

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

  const truncateString = (string, maxLength) => {
    if (string.length > maxLength) {
      if (string.includes('-')) {
        const coursesRemoved = string.replace('/courses', '')
        if (coursesRemoved.length <= maxLength) { return coursesRemoved}
        const words = coursesRemoved.split('-')

        const truncator = () => {
          const len = words.reduce(
            (accumulator, currentValue) => accumulator + currentValue.length,
            0
          )

          if(len > maxLength) {
            words.splice(-1,1)
            return truncator()
          } else {
            return words.join('-')
          }
        }
        return truncator()
      }
      // check for spaces
  
    } else {
      return string
    }
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

        const response = await fetch(`${baseAnalyticsApiUrl}/api/v1/pages/routes/total-time-views?startdate=${startDate}&enddate=${endDate}&levels=${2}`, requestOptions)
        const result = await response.json()
        
        if(result.status === 'ok') {
          const dateOptions = {
            month: 'long',
            day: 'numeric'
          }
          setStartDateViews(formatDateHuman(startDateJs, dateOptions))
          setEndDateViews(formatDateHuman(endDateJs, dateOptions))

          const { data: ttvbcr } = result

          const sortedTotalViewsByConsolidatedRoute = ttvbcr.toSorted((a, b) => {
            return b.total_views - a.total_views
          })

          const sortedTotalTimeByConsolidatedRoute = ttvbcr.toSorted((a, b) => {
            return b.total_time - a.total_time
          })

          const totalViewsByConsolidatedRoute = sortedTotalViewsByConsolidatedRoute.map(item => {
            const { 'route_consolidated': routeConsolidated, 'total_views': value } = item
            const dataLabel = routeConsolidated
            return({ dataLabel, value })
          })

          const totalTimeByConsolidatedRoute = sortedTotalTimeByConsolidatedRoute.map(item => {
            const { 'route_consolidated': routeConsolidated, 'total_time': value } = item
            const dataLabel = routeConsolidated
            return({ dataLabel, value })
          })
      
          const totalViewsByConsolidatedRouteFinal = totalViewsByConsolidatedRoute.length > 5 ? exceededFormatted(totalViewsByConsolidatedRoute) : totalViewsByConsolidatedRoute
          const totalTimeByConsolidatedRouteFinal = totalTimeByConsolidatedRoute.length > 5 ? exceededFormatted(totalTimeByConsolidatedRoute) : totalTimeByConsolidatedRoute

          setTotalViewsByConsolidatedRouteFormatted(totalViewsByConsolidatedRouteFinal)
          setTotalTimeByConsolidatedRouteFormatted(totalTimeByConsolidatedRouteFinal)
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

        const response = await fetch(`${baseAnalyticsApiUrl}/api/v1/sessions/by-day?startdate=${startDate}&enddate=${endDate}`, requestOptions)
        const result = await response.json()
        
        if(result.status === 'ok') {
          const dateOptions = {
            month: 'long',
            day: 'numeric'
          }

          setStartDateVisits(formatDateHuman(startDateJs, dateOptions))
          setEndDateVisits(formatDateHuman(endDateJs, dateOptions))

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

          const totalTimeByDayFinal = totalVisitsWithZeros.map(item => {
            const { day, total_time } = item
            const dayParts = day.split('-')
            const jsDate = new Date(dayParts[0], dayParts[1] -1, dayParts[2])

            const options = { weekday: 'short' }
            const dateTimeFormat = new Intl.DateTimeFormat('en-US', options)
            const dateFormatted = dateTimeFormat.format(jsDate)

            const minutes = total_time === undefined ? Number(0) : total_time / 1000 / 60
            return { day: dateFormatted, count: minutes }
          })

          setTotalTimeByDayFormatted(totalTimeByDayFinal)
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
  
          const { data: ttvbr } = result
          setTotalTimeViewsByRoute(ttvbr)

          const sortedTotalViewsByRoute = ttvbr.toSorted((a, b) => {
            return b.total_views - a.total_views
          })

          const sortedTotalTimeByRoute = ttvbr.toSorted((a, b) => {
            return b.total_time - a.total_time
          })

          const filteredTotalTimeViewsByRoute = ttvbr.filter(item => {
            const { route } = item
            return route.includes('/courses/')
          })

          const sortedFilteredTotalViewsByRoute = filteredTotalTimeViewsByRoute.toSorted((a, b) => {
            return b.total_views - a.total_views
          })

          const sortedFilteredTotalTimeByRoute = filteredTotalTimeViewsByRoute.toSorted((a, b) => {
            return b.total_time - a.total_time
          })

          const totalFilteredViewsByRoute = sortedFilteredTotalViewsByRoute.map(item => {
            const { route, 'total_views': value } = item
            const routeSlug = route.split('/').pop()
            const dataLabel = formatSlug(routeSlug)
            return({ dataLabel, value })
          })

          const totalFilteredTimeByRoute = sortedFilteredTotalTimeByRoute.map(item => {
            const { route, 'total_time': value } = item
            const routeSlug = route.split('/').pop()
            const dataLabel = formatSlug(routeSlug)
            return({ dataLabel, value })
          })
      
          const totalFilteredViewsByRouteFinal = totalFilteredViewsByRoute.length > 5 ? exceededFormatted(totalFilteredViewsByRoute) : totalFilteredViewsByRoute
          const totalFilteredTimeByRouteFinal = totalFilteredTimeByRoute.length > 5 ? exceededFormatted(totalFilteredTimeByRoute) : totalFilteredTimeByRoute

          setTotalFilteredViewsByRouteFormatted(totalFilteredViewsByRouteFinal)
          setTotalFilteredTimeByRouteFormatted(totalFilteredTimeByRouteFinal)
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

        const response = await fetch(`${baseAnalyticsApiUrl}/api/v1/pages/entry?startdate=${startDate}&enddate=${endDate}`, requestOptions)
        const result = await response.json()

        if(result.status === 'ok') {
          const dateOptions = {
            month: 'long',
            day: 'numeric'
          }

          setStartDateEntryViews(formatDateHuman(startDateJs, dateOptions))
          setEndDateEntryViews(formatDateHuman(endDateJs, dateOptions))
  
          const { data: tebr } = result
          setTotalEntriesByRoute(tebr)

          const sortedTotalEntriesByRoute = tebr.toSorted((a, b) => {
            return b.entry_page_count - a.entry_page_count
          })

          const totalSortedEntriesByRoute = sortedTotalEntriesByRoute.map(item => {
            const { 'entry_page': dataLabel, 'entry_page_count': value } = item
            const dlt = truncateString(dataLabel, 14)
            return({ dataLabel: dlt, value })
          })

          const totalSortedEntriesByRouteFinal = totalSortedEntriesByRoute.length > 7 ? exceededTruncated(totalSortedEntriesByRoute, 7) : totalSortedEntriesByRoute

          setTotalEntriesByRouteFormatted(totalSortedEntriesByRouteFinal)
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

  const ChartBarEntryPages = () => (
    <ChartBar
      categoryKey='dataLabel'
      chartData={totalEntriesByRouteFormatted}
      seriesName='Views'
      startFromValue={0}
    />
  )

  const ChartColumnVisits = () => (
    <ChartColumn
      categoryName='Days'
      categoryKey='day'
      chartData={totalVisitsByDayFormatted}
      seriesName='Visits'
      startFromValue={0}
    />
  )

  const ChartColumnViews = () => (
    <ChartColumn
      categoryName='Days'
      categoryKey='day'
      chartData={totalViewsByDayFormatted}
      seriesName='Page Views'
      startFromValue={0}
    />
  )

  const ChartColumnTime = () => (
    <ChartColumn
      categoryName='Days'
      categoryKey='day'
      chartData={totalTimeByDayFormatted}
      seriesName='Minutes'
      startFromValue={0}
    />
  )

  return(
    <>
      <h1 className="admin-lead extended">Administration</h1>
      <Grid container rowSpacing={2} columnSpacing={{ sm: 0, md: 10}}>
        <Grid xs={12} md={6} lg={4} xl={3}>
          <LayoutChart
            chart={ChartColumnVisits}
            subtitle={`${startDateVisits} to ${endDateVisits}`}
            source="No Car Gravel"
            title="Visits by Weekday"
          />
        </Grid>
        <Grid xs={12} md={6} lg={4} xl={3}>
          <LayoutChart
            chart={ChartColumnViews}
            subtitle={`${startDateVisits} to ${endDateVisits}`}
            source="No Car Gravel"
            title="Page Views by Weekday"
          />
        </Grid>
        <Grid xs={12} md={6} lg={4} xl={3}>
          <LayoutChart
            chart={ChartColumnTime}
            subtitle={`${startDateVisits} to ${endDateVisits}`}
            source="No Car Gravel"
            title="Viewing Time by Weekday"
          />
        </Grid>
      </Grid>
      <Grid container rowSpacing={2} columnSpacing={{ sm: 0, md: 10}}>
        <Grid xs={12} md={6} lg={4} xl={3}>
          <LayoutChart
              chart={ChartPie}
              chartColors={['#94fa70', '#00cd9c', '#0095a4', '#006291', '#292f56']}
              chartData={totalViewsByConsolidatedRouteFormatted}
              startAngle={-90}
              subtitle={`${startDateViews} to ${endDateViews}`}
              source="No Car Gravel"
              title="Routes by Page Views"
          />  
        </Grid>
        <Grid xs={12} md={6} lg={4} xl={3}>
          <LayoutChart
              chart={ChartPie}
              chartColors={['#94fa70', '#00cd9c', '#0095a4', '#006291', '#292f56']}
              chartData={totalFilteredViewsByRouteFormatted}
              startAngle={-90}
              subtitle={`${startDateViews} to ${endDateViews}`}
              source="No Car Gravel"
              title="Courses by Page Views"
          />  
        </Grid>
        <Grid xs={12} md={6} lg={4} xl={3}>
          <LayoutChart
            chart={ChartPie}
            chartColors={['#94fa70', '#00cd9c', '#0095a4', '#006291', '#292f56']}
            chartData={totalFilteredTimeByRouteFormatted}
            startAngle={-90}
            subtitle={`${startDateViews} to ${endDateViews}`}
            source="No Car Gravel"
            title="Courses by Viewing Time"
          />
        </Grid>
      </Grid>
      <Grid container rowSpacing={2} columnSpacing={{ sm: 0, md: 10}}>
      <Grid xs={12} md={6} lg={4} xl={3}>
          <LayoutChart
            chart={ChartBarEntryPages}
            subtitle={`${startDateEntryViews} to ${endDateEntryViews}`}
            source="No Car Gravel"
            title="Entry Pages by Views"
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid xs={6} md={4} lg={3} xl={2}>
          <div>
            <DisplayStatisticNumber
              statisticName='Total Visits'
              statisticValue={totalVisits}
            />
          </div>
        </Grid>
        <Grid xs={6} md={4} lg={3} xl={2}>
          <div>
            <DisplayStatisticNumber
              statisticName='Unique Visits'
              statisticValue={uniqueVisits}
            />
          </div>
        </Grid>
        <Grid xs={6} md={4} lg={3} xl={2}>
          <div>
            <DisplayStatisticNumber
              statisticName='Single Page Sessions'
              statisticValue={totalSinglePageSessions}
            />
          </div>
        </Grid>
        <Grid xs={6} md={4} lg={3} xl={2}>
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
