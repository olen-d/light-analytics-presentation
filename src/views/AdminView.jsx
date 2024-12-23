import { useEffect, useState } from 'react'

import ChartBar from '../components/ChartBar'
import LayoutChart from '../components/LayoutChart'
import LayoutPartOfWhole from '../components/LayoutPartOfWhole'
import LayoutTimeSeries from '../components/LayoutTimeSeries'
import WidgetStatistics from '../components/WidgetStatistics'

import { Unstable_Grid2 as Grid } from '@mui/material'

const AdminView = () => {
  const apiKeyRead = import.meta.env.VITE_ANALYTICS_API_KEY_READ
  const baseAnalyticsApiUrl = import.meta.env.VITE_ANALYTICS_API_BASE_URL

  const formatDateJs = date => {
    const dayJs = date.getDate()
    const monthJs = date.getMonth() + 1
    const day = dayJs.toString().padStart(2, '0')
    const month = monthJs.toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${year}-${month}-${day}`
  }

  // Set up dates for the statistics Widgets
  const widgetStatsEndDateJs = new Date()
  const widgetStatsStartDateJs = new Date()
  widgetStatsStartDateJs.setDate(widgetStatsStartDateJs.getDate() - 6)
  const widgetStatsEndDateInitial = formatDateJs(widgetStatsEndDateJs)
  const widgetStatsStartDateInitial = formatDateJs(widgetStatsStartDateJs)

  const [startDateEntryViews, setStartDateEntryViews] = useState(null)
  const [endDateEntryViews, setEndDateEntryViews] = useState(null)
  const [startDateExitViews, setStartDateExitViews] = useState(null)
  const [endDateExitViews, setEndDateExitViews] = useState(null)
  const [totalEntriesByRoute, setTotalEntriesByRoute] = useState([])
  const [totalExitsByRoute, setTotalExitsByRoute] = useState([])
  const [totalEntriesByRouteFormatted, setTotalEntriesByRouteFormatted] = useState([])
  const [totalExitsByRouteFormatted, setTotalExitsByRouteFormatted] = useState([])

// Monthly 
  const [totalVisitsByMonth, setTotalVisitsByMonth] = useState([])
  const [totalVisitsByMonthFormatted, setTotalVisitsByMonthFormatted] = useState([])
// End Monthly
  const [widgetStatsEndDate, setWidgetStatsEndDate] = useState(widgetStatsEndDateInitial)
  const [widgetStatsStartDate, setWidgetStatsStartDate] = useState(widgetStatsStartDateInitial)
  // Utility Functions
  const exceededTruncated = (values, limit) => {
    return values.slice(0, limit)
  }

  const formatDateHuman = (date, options) => {
    const dateTimeFormatHuman = new Intl.DateTimeFormat('en-US', options).format(date)
    return dateTimeFormatHuman
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

        const response = await fetch(`${baseAnalyticsApiUrl}/api/v1/pages/exit?startdate=${startDate}&enddate=${endDate}`, requestOptions)
        const result = await response.json()

        if(result.status === 'ok') {
          const dateOptions = {
            month: 'long',
            day: 'numeric'
          }

          setStartDateExitViews(formatDateHuman(startDateJs, dateOptions))
          setEndDateExitViews(formatDateHuman(endDateJs, dateOptions))
  
          const { data: texbr } = result
          setTotalExitsByRoute(texbr)

          const sortedTotalExitsByRoute = texbr.toSorted((a, b) => {
            return b.exit_page_count - a.exit_page_count
          })

          const totalSortedExitsByRoute = sortedTotalExitsByRoute.map(item => {
            const { 'exit_page': dataLabel, 'exit_page_count': value } = item
            const dlt = truncateString(dataLabel, 14)
            return({ dataLabel: dlt, value })
          })

          const totalSortedExitsByRouteFinal = totalSortedExitsByRoute.length > 7 ? exceededTruncated(totalSortedExitsByRoute, 7) : totalSortedExitsByRoute

          setTotalExitsByRouteFormatted(totalSortedExitsByRouteFinal)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])
// Monthly
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

      const response = await fetch(`${baseAnalyticsApiUrl}/api/v1/sessions/by-month`, requestOptions)
      const result = await response.json()

      if(result.status === 'ok') {
        // const dateOptions = {
        //   month: 'long',
        //   day: 'numeric'
        // }

        const { data: { totalVisitsByMonth : tvbm } } = result
        setTotalVisitsByMonth(tvbm)

        // const sortedTotalExitsByRoute = texbr.toSorted((a, b) => {
        //   return b.exit_page_count - a.exit_page_count
        // })

        const totalVisitsByMonthFinal = tvbm.map(item => {
          const { 'month': yearMonth, 'count': value } = item

          const dayParts = yearMonth.split('-')
          const jsDate = new Date(dayParts[0], dayParts[1] - 1)

          const options = { month: 'short' }
          const dateTimeFormat = new Intl.DateTimeFormat('en-US', options)
          const dateFormatted = dateTimeFormat.format(jsDate)
          return({ month: dateFormatted, value })
        })

        // const totalSortedExitsByRouteFinal = totalSortedExitsByRoute.length > 7 ? exceededTruncated(totalSortedExitsByRoute, 7) : totalSortedExitsByRoute

        setTotalVisitsByMonthFormatted(totalVisitsByMonthFinal)
      }
    } catch (error) {
      console.log(error)
    }
  }
  fetchData()
}, [])
// End Monthly

  const ChartBarEntryPages = () => (
    <ChartBar
      categoryKey='dataLabel'
      chartData={totalEntriesByRouteFormatted}
      seriesName='Views'
      startFromValue={0}
    />
  )

  const ChartBarExitPages = () => (
    <ChartBar
      categoryKey='dataLabel'
      chartData={totalExitsByRouteFormatted}
      seriesName='Views'
      startFromValue={0}
    />
  )

  return(
    <>
      <h1 className="admin-lead extended">Administration</h1>
      <Grid container rowSpacing={2} columnSpacing={{ sm: 0, md: 10}}>
        <Grid xs={12} md={6} lg={4} xl={3}>
          <LayoutTimeSeries
            apiKeyRead={apiKeyRead}
            baseAnalyticsApiUrl={baseAnalyticsApiUrl}
            dateLabelFormatOptions={{ weekday: 'short' }}
            dateRangeFormatOptions={{ month: 'long', day: 'numeric' }}
            endpoint="api/v1/sessions/by-day"
            queryString={`?startdate=${widgetStatsStartDate}&enddate=${widgetStatsEndDate}`}
            seriesName="Visits"
            source="No Car Gravel"
            statisticKey="totalVisitsByDay"
            statisticTimeKey="day"
            statisticValueKey="count"
            title="Visits by Weekday"
          />
        </Grid>
        <Grid xs={12} md={6} lg={4} xl={3}>
        <LayoutTimeSeries
            apiKeyRead={apiKeyRead}
            baseAnalyticsApiUrl={baseAnalyticsApiUrl}
            dateLabelFormatOptions={{ weekday: 'short' }}
            dateRangeFormatOptions={{ month: 'long', day: 'numeric' }}
            endpoint="api/v1/pages/by-day"
            queryString={`?startdate=${widgetStatsStartDate}&enddate=${widgetStatsEndDate}`}
            source="No Car Gravel"
            seriesName="Views"
            statisticKey="totalViewsByDay"
            statisticTimeKey="day"
            statisticValueKey="count"
            title="Page Views by Weekday"
          />
        </Grid>
        <Grid xs={12} md={6} lg={4} xl={3}>
        <LayoutTimeSeries
            apiKeyRead={apiKeyRead}
            baseAnalyticsApiUrl={baseAnalyticsApiUrl}
            dateLabelFormatOptions={{ weekday: 'short' }}
            dateRangeFormatOptions={{ month: 'long', day: 'numeric' }}
            endpoint="api/v1/pages/by-day"
            queryString={`?startdate=${widgetStatsStartDate}&enddate=${widgetStatsEndDate}`}
            seriesName="Minutes"
            source="No Car Gravel"
            statisticKey="totalViewsByDay"
            statisticTimeKey="day"
            statisticValueKey="total_time"
            title="Viewing Time by Weekday"
            valueFormatOptions="microsecondsToMinutes"
          />
        </Grid>
      </Grid>
      <Grid container rowSpacing={2} columnSpacing={{ sm: 0, md: 10}}>
        <Grid xs={12} md={6} lg={4} xl={3}>
          <LayoutPartOfWhole
            apiKeyRead={apiKeyRead}
            baseAnalyticsApiUrl={baseAnalyticsApiUrl}
            dateLabelFormatOptions={{ weekday: 'short' }}
            dateRangeFormatOptions={{ month: 'long', day: 'numeric' }}
            endpoint="api/v1/pages/routes/total-views"
            queryString={`?startdate=${widgetStatsStartDate}&enddate=${widgetStatsEndDate}&levels=2`}
            source="No Car Gravel"
            statisticKey="data"
            statisticCategoryKey="route_consolidated"
            statisticValueKey="total_views"
            title="Routes by Page Views"
          />
        </Grid>
        <Grid xs={12} md={6} lg={4} xl={3}>
          <LayoutPartOfWhole
            apiKeyRead={apiKeyRead}
            baseAnalyticsApiUrl={baseAnalyticsApiUrl}
            dateRangeFormatOptions={{ month: 'long', day: 'numeric' }}
            endpoint="api/v1/pages/routes/components/total-views"
            queryString={`?componentName=courses&startdate=${widgetStatsStartDate}&enddate=${widgetStatsEndDate}`}
            shouldFormatSlug={true}
            source="No Car Gravel"
            statisticKey="data"
            statisticCategoryKey="component_summary"
            statisticValueKey="total_views"
            title="Courses by Page Views"
          />
        </Grid>
        <Grid xs={12} md={6} lg={4} xl={3}>
          <LayoutPartOfWhole
            apiKeyRead={apiKeyRead}
            baseAnalyticsApiUrl={baseAnalyticsApiUrl}
            dateRangeFormatOptions={{ month: 'long', day: 'numeric' }}
            endpoint="api/v1/pages/routes/components/total-time"
            queryString={`?componentName=courses&startdate=${widgetStatsStartDate}&enddate=${widgetStatsEndDate}`}
            shouldFormatSlug={true}
            source="No Car Gravel"
            statisticKey="data"
            statisticCategoryKey="component_summary"
            statisticValueKey="total_time"
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
        <Grid xs={12} md={6} lg={4} xl={3}>
          <LayoutChart
            chart={ChartBarExitPages}
            subtitle={`${startDateExitViews} to ${endDateExitViews}`}
            source="No Car Gravel"
            title="Exit Pages by Views"
          />
        </Grid>
        <Grid xs={12} md={6} lg={4} xl={3}>
          <LayoutPartOfWhole
            apiKeyRead={apiKeyRead}
            baseAnalyticsApiUrl={baseAnalyticsApiUrl}
            dateRangeFormatOptions={{ month: 'long', day: 'numeric' }}
            endpoint="api/v1/pages/routes/components/total-time"
            queryString={`?componentName=courses&startdate=${widgetStatsStartDate}&enddate=${widgetStatsEndDate}`}
            shouldFormatSlug={true}
            source="No Car Gravel"
            statisticKey="data"
            statisticCategoryKey="component_summary"
            statisticValueKey="total_time"
            title="Courses by Viewing Time"
          />
        </Grid>
      </Grid>
      <Grid container rowSpacing={2} columnSpacing={{ sm:0, md: 10 }}>
        <Grid xs={6} md={4} lg={3} xl={2}>
          <WidgetStatistics
            apiKeyRead={apiKeyRead}
            baseAnalyticsApiUrl={baseAnalyticsApiUrl}
            endpoint={`api/v1/sessions?startdate=${widgetStatsStartDate}&enddate=${widgetStatsEndDate}`}
            statisticChangeKey="totalVisitsChange"
            statisticKey="totalVisits"
            statisticName="Total Visits"
          />
        </Grid>
        <Grid xs={6} md={4} lg={3} xl={2}>
          <WidgetStatistics
            apiKeyRead={apiKeyRead}
            baseAnalyticsApiUrl={baseAnalyticsApiUrl}
            endpoint={`api/v1/sessions/unique?startdate=${widgetStatsStartDate}&enddate=${widgetStatsEndDate}`}
            statisticChangeKey="uniqueVisitsChange"
            statisticKey="uniqueVisits"
            statisticName="Unique Visits"
          />
        </Grid>
        <Grid xs={6} md={4} lg={3} xl={2}>
          <WidgetStatistics
            apiKeyRead={apiKeyRead}
            baseAnalyticsApiUrl={baseAnalyticsApiUrl}
            endpoint={`api/v1/pages/time-on-pages/average?startdate=${widgetStatsStartDate}&enddate=${widgetStatsEndDate}`}
            statisticChangeKey={"timeOnPageAverageChange"}
            statisticFormat="elapsedTime"
            statisticKey="timeOnPageAverage"
            statisticName="Visit Duration"
          />
        </Grid>
        <Grid xs={6} md={4} lg={3} xl={2}>
          <WidgetStatistics
            apiKeyRead={apiKeyRead}
            baseAnalyticsApiUrl={baseAnalyticsApiUrl}
            endpoint={`api/v1/sessions/bounce-rate?startdate=${widgetStatsStartDate}&enddate=${widgetStatsEndDate}`}
            reverseChangeColors={true}
            statisticChangeKey={"bounceRateChange"}
            statisticFormat="percent"
            statisticKey="bounceRate"
            statisticName="Bounce Rate"
          />
        </Grid>
        <Grid xs={6} md={4} lg={3} xl={2}>
          <WidgetStatistics
            apiKeyRead={apiKeyRead}
            baseAnalyticsApiUrl={baseAnalyticsApiUrl}
            endpoint={`api/v1/pages?startdate=${widgetStatsStartDate}&enddate=${widgetStatsEndDate}`}
            statisticChangeKey="totalViewsChange"
            statisticKey="totalViews"
            statisticName="Total Views"
          />
        </Grid>
        <Grid xs={6} md={4} lg={3} xl={2}>
          <WidgetStatistics
            apiKeyRead={apiKeyRead}
            baseAnalyticsApiUrl={baseAnalyticsApiUrl}
            endpoint={`api/v1/pages/views/per-visit?startdate=${widgetStatsStartDate}&enddate=${widgetStatsEndDate}`}
            round={1}
            statisticChangeKey="viewsPerVisitChange"
            statisticKey="viewsPerVisit"
            statisticName="Views Per Visit"
          />
        </Grid>
        <Grid xs={6} md={4} lg={3} xl={2}>
          <WidgetStatistics
            apiKeyRead={apiKeyRead}
            baseAnalyticsApiUrl={baseAnalyticsApiUrl}
            endpoint={`api/v1/pages/time/per-view?startdate=${widgetStatsStartDate}&enddate=${widgetStatsEndDate}`}
            statisticChangeKey="timePerPageviewChange"
            statisticFormat="elapsedTime"
            statisticKey="timePerPageview"
            statisticName="Time Per Pageview"
          />
        </Grid>
      </Grid>
    </>
  )
}

export default AdminView
