import { useEffect, useState } from 'react'

import useFetchData from '../hooks/useFetchData'

import ChartLine from '../components/ChartLine'
import LayoutChart from '../components/LayoutChart'
import SelectPeriod from '../components/SelectPeriod'
import SubtitleChart from '../components/SubtitleChart'
import TableSort from '../components/TableSort'
import WidgetStatistics from '../components/WidgetStatistics'

import { Unstable_Grid2 as Grid } from '@mui/material'

const apiKeyRead = import.meta.env.VITE_ANALYTICS_API_KEY_READ
const baseAnalyticsApiUrl = import.meta.env.VITE_ANALYTICS_API_BASE_URL

const ContentView = () => {
  const [chartSize, setChartSize] = useState(null)
  const [widgetQueryString, setWidgetQueryString] = useState('')

  const MonthlyViews = () => {

    const url = `${baseAnalyticsApiUrl}/api/v1/pages/by-month`
    const requestConfig = {
      apiKey: apiKeyRead,
      method: 'GET',
      url
    }

    const { fetchResult, isLoading, error } = useFetchData(requestConfig)
    if (isLoading) {
      return 'Loading...'
    } else {
      const { data: { totalViewsByMonth : tvbm } } = fetchResult

      const startDateYearMonth = tvbm[0].month
      const endDateYearMonth = tvbm[tvbm.length -1].month

      const startDateDayParts = startDateYearMonth.split('-')
      const endDateDayParts = endDateYearMonth.split('-')

      const startDateJsDate = new Date(startDateDayParts[0], startDateDayParts[1] -1)
      const endDateJsDate = new Date(endDateDayParts[0], endDateDayParts[1] -1)

      const startEndDateOptions = { month: 'long', year: 'numeric' }
      const startEndDateTimeFormat = new Intl.DateTimeFormat('en-US', startEndDateOptions)

      const startDateFormatted = startEndDateTimeFormat.format(startDateJsDate)
      const endDateFormatted = startEndDateTimeFormat.format(endDateJsDate)
    
      const totalViewsByMonthFinal = tvbm.map(item => {
        const { 'month': yearMonth, 'count': value } = item

        const dayParts = yearMonth.split('-')
        const jsDate = new Date(dayParts[0], dayParts[1] - 1)

        const options = { month: 'short' }
        const dateTimeFormat = new Intl.DateTimeFormat('en-US', options)
        const dateFormatted = dateTimeFormat.format(jsDate)
        return({ month: dateFormatted, value })
      })

      return(
        <>
          <SubtitleChart subtitle={`${startDateFormatted} to ${endDateFormatted}`} />
          <ChartLine
            categoryName='Months'
            categoryKey='month'
            chartData={totalViewsByMonthFinal}
            chartSize={chartSize}
            seriesName='Visits'
            startFromValue={0}
          />
        </>
      )
    }
  }

  const ContentViewsSummary = () => {
    const url = `${baseAnalyticsApiUrl}/api/v1/pages/summary/by-route`
    const requestConfig = {
      apiKey: apiKeyRead,
      method: 'GET',
      url
    }

    const { fetchResult, isLoading, error } = useFetchData(requestConfig)
    if (isLoading) {
      return 'Loading...'
    } else {
      const { data: { contentSummaryByRoute } } = fetchResult

      const formatDuration = (duration, output)  => {
        const durationSeconds = Math.round(duration / 1000)

        if (output === 'hh:mm:ss') {
          const totalHours = Math.floor(durationSeconds / 3600)
          const remainderSeconds = durationSeconds % 3600
          const totalMinutes = Math.floor(remainderSeconds / 60)
          const totalSeconds = remainderSeconds % 60

          const hh = totalHours.toString().padStart(2, '0')
          const mm = totalMinutes.toString().padStart(2, '0')
          const ss = totalSeconds.toString().padStart(2, '0')

          return (`${hh}:${mm}:${ss}`)
        }
      }

      const headings = [
        'Route',
        'Page Views',
        'Unique Page Views',
        'Average Time on Page',
        'Entrances',
        'Exits',
        'Bounce Rate'
      ]

      const rowKeys = contentSummaryByRoute.map(element => {
        const { route: key } = element
        return key
      })

      const rows = contentSummaryByRoute.map(element => {
        const {
          route,
          totalViews,
          uniquePageViews,
          averageTimeOnPage,
          entrances,
          exits,
          bounceRate
        } = element
        const averageTimeOnPageFormatted = formatDuration(averageTimeOnPage, 'hh:mm:ss')
        const bounceRateFormatted = `${Math.round(bounceRate * 100)}%` 
        return([route, totalViews, uniquePageViews, averageTimeOnPageFormatted, entrances, exits, bounceRateFormatted])
      })

      return(<TableSort headings={headings} rows={rows} rowKeys={rowKeys} />)
    }
  }

  const handleWidgetQueryString = data => {
    setWidgetQueryString(data)
  }

  useEffect(() => {
    const screen = {
      xs: null,
      sm: window.matchMedia('(min-width: 600px)'),
      md: window.matchMedia('(min-width: 900px)'),
      lg: window.matchMedia('(min-width: 1200px)'),
    }
  
    const mqHandler = () => {
      let size = null
      for (let [scr, mq] of Object.entries(screen)) {
        if (!mq || mq.matches) size = scr
      }
      setChartSize(size)
    }
  
    for (let [scr, mq] of Object.entries(screen)) {
      if (mq) mq.addEventListener('change', mqHandler)
    }
   
    mqHandler()
  }, [])

  return(
    <div className='content-view'>
      <h1 className="admin-lead extended">Administration &raquo; Content</h1>
      <Grid container rowSpacing={2} columnSpacing={{ sm: 0, md: 10}}>
        <Grid size={12}>
          <LayoutChart
            chart={MonthlyViews}
            source="No Car Gravel"
            title="Page Views by Month"
          />
        </Grid>
      </Grid>
      <Grid container rowSpacing={2} columnSpacing={{ sm:0, md: 10 }}>
      <Grid xs={12} sm={6} md={9}>
          <div className="widget-statistics-title">
            Content Statistics
          </div>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <SelectPeriod
            id="content-statistics-period"
            initialPeriod="forever"
            labeltext="period"
            onQueryString={handleWidgetQueryString}
          />
        </Grid>
        <Grid xs={6} md={4} lg={3} xl={2}>
          <WidgetStatistics
            apiKeyRead={apiKeyRead}
            baseAnalyticsApiUrl={baseAnalyticsApiUrl}
            endpoint="api/v1/pages"
            queryString={widgetQueryString}
            statisticChangeKey="totalViewsChange"
            statisticKey="totalViews"
            statisticName="Total Views"
          />
        </Grid>
        <Grid xs={6} md={4} lg={3} xl={2}>
          <WidgetStatistics
            apiKeyRead={apiKeyRead}
            baseAnalyticsApiUrl={baseAnalyticsApiUrl}
            endpoint="api/v1/pages/views/per-visit"
            queryString={widgetQueryString}
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
            endpoint="api/v1/pages/time/per-view"
            queryString={widgetQueryString}
            statisticChangeKey="timePerPageviewChange"
            statisticFormat="elapsedTime"
            statisticKey="timePerPageview"
            statisticName="Time Per Pageview"
          />
        </Grid>
      </Grid>
      <Grid container rowSpacing={2} columnSpacing={{ sm:0, md: 10 }}>
        <Grid>
          <ContentViewsSummary />
        </Grid>
      </Grid>
    </div>
  )
}

export default ContentView
