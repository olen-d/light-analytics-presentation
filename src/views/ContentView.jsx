import { useEffect, useState } from 'react'

import useFetchData from '../hooks/useFetchData'

import ChartLine from '../components/ChartLine'
import DisplayStatisticNumber from '../components/DisplayStatisticNumber'
import LayoutChart from '../components/LayoutChart'
import SelectGeneric from '../components/form-fields/SelectGeneric'
import SubtitleChart from '../components/SubtitleChart'
import TableSort from '../components/TableSort'
import WidgetStatistics from '../components/WidgetStatistics'

import { Unstable_Grid2 as Grid } from '@mui/material'

const apiKeyRead = import.meta.env.VITE_ANALYTICS_API_KEY_READ
const baseAnalyticsApiUrl = import.meta.env.VITE_ANALYTICS_API_BASE_URL

const ContentView = () => {
  const [chartSize, setChartSize] = useState(null)
  const [viewStatsPeriod, setViewStatsPeriod] = useState('forever')
  const [widgetQueryString, setWidgetQueryString] = useState('')

  const formatDateJs = date => {
    const dayJs = date.getDate()
    const monthJs = date.getMonth() + 1
    const day = dayJs.toString().padStart(2, '0')
    const month = monthJs.toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${year}-${month}-${day}`
  }

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

  const handleChangeOptionsStatisticsViews = event => {
    const { target: { value: selectValue }, } = event

    setViewStatsPeriod(selectValue)

    const widgetStatsEndDateJs = new Date()
    const widgetStatsStartDateJs = new Date()
    
    const widgetStatsEndDate = formatDateJs(widgetStatsEndDateJs)

    let widgetStatsStartDate = null

    switch (selectValue) {
      case 'last7d':
        widgetStatsStartDateJs.setDate(widgetStatsStartDateJs.getDate() - 6)
        widgetStatsStartDate = formatDateJs(widgetStatsStartDateJs)
        setWidgetQueryString(`?startdate=${widgetStatsStartDate}&enddate=${widgetStatsEndDate}`)
        break
      case 'last30d':
        widgetStatsStartDateJs.setDate(widgetStatsStartDateJs.getDate() - 29)
        widgetStatsStartDate = formatDateJs(widgetStatsStartDateJs)
        setWidgetQueryString(`?startdate=${widgetStatsStartDate}&enddate=${widgetStatsEndDate}`)
        break
      case 'last6m':
        widgetStatsStartDateJs.setMonth(widgetStatsStartDateJs.getMonth() - 6)
        widgetStatsStartDate = formatDateJs(widgetStatsStartDateJs)
        setWidgetQueryString(`?startdate=${widgetStatsStartDate}&enddate=${widgetStatsEndDate}`)
        break
      case 'last12m':
        widgetStatsStartDateJs.setMonth(widgetStatsStartDateJs.getMonth() - 12)
        widgetStatsStartDate = formatDateJs(widgetStatsStartDateJs)
        setWidgetQueryString(`?startdate=${widgetStatsStartDate}&enddate=${widgetStatsEndDate}`)
        break
      case 'forever':
      default:
        setWidgetQueryString('')
    }
  }

  const optionsStatisticsViews = [
    {
      label: 'Last 7 Days',
      value: 'last7d',
      description: ''
    },
    {
      label: 'Last 30 Days',
      value: 'last30d',
      description: ''
    },
    {
      label: 'Last 6 Months',
      value: 'last6m',
      description: ''
    },
    {
      label: 'Last 12 Months',
      value: 'last12m',
      description: ''
    },
    {
      label: 'All Time',
      value: 'forever',
      description: ''
    }
  ]

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
          <div className="widget-statistics-select-period">
            <SelectGeneric
              handleChange={handleChangeOptionsStatisticsViews}
              id='select-generic-statistics-visits-period'
              initialValue={viewStatsPeriod}
              labelId='select-generic-statistics-visits-period-label'
              labeltext="Period"
              options={optionsStatisticsViews}
            />
          </div>
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
