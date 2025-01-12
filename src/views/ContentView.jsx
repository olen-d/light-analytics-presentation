import { useEffect, useState } from 'react'

import useFetchData from '../hooks/useFetchData'

import LayoutTimeSeries from '../components/LayoutTimeSeries'
import LayoutTable from '../components/LayoutTable'
import SelectPeriod from '../components/SelectPeriod'
import TableSort from '../components/TableSort'
import ToolbarOptions from '../components/ToolbarOptions'
import WidgetStatistics from '../components/WidgetStatistics'

import { Unstable_Grid2 as Grid } from '@mui/material'

const apiKeyRead = import.meta.env.VITE_ANALYTICS_API_KEY_READ
const baseAnalyticsApiUrl = import.meta.env.VITE_ANALYTICS_API_BASE_URL

const ContentView = () => {
  const [chartSize, setChartSize] = useState(null)
  const [periodInterval, setPeriodInterval] = useState('')
  const [periodQueryString, setPeriodQueryString] = useState('')
  const [timeSeriesCategoryKey, setTimeSeriesCategoryKey] = useState('month')
  const [timeSeriesCategoryName, setTimeSeriesCategoryName] = useState('Months')
  const [timeSeriesDateLabelFormatOptions, setTimeSeriesDateLabelFormatOptions] = useState({ month: 'short' })
  const [timeSeriesDateRangeFormatOptions, setTimeSeriesDateRangeFormatOptions] = useState({ month: 'long', year: 'numeric' })
  const [timeSeriesEndpointInterval, setTimeSeriesEndpointInterval] = useState('by-month')
  const [timeSeriesIntervalFormatted, setTimeSeriesIntervalFormatted] = useState('Month')
  const [timeSeriesStatisticKey, setTimeSeriesStatisticKey] = useState('totalViewsByMonth')
  const [timeSeriesStatisticTimeKey, setTimeSeriesStatisticTimeKey] = useState('month')
  const [viewStatisticCategoriesToFormat, setViewStatisticCategoriesToFormat] = useState([])
  const [viewStatisticEndpoint, setViewStatisticEndpoint] = useState('api/v1/pages/routes/total-views')
  const [viewStatisticHeadings, setViewStatisticHeadings] = useState(['Route', 'Views'])
  const [viewStatisticItemKeys, setViewStatisticItemKeys] = useState(['id', 'route', 'total_views'])
  const [viewStatisticShouldFormatCategories, setViewStatisticShouldFormatCategories] = useState(false)


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

  const handleViewStatisticChange = data => {
    const viewStatistic = data
    switch(viewStatistic) {
      case 'average':
        setViewStatisticCategoriesToFormat([{ 'category': 'time_per_view', 'format': 'elapsedTime' }])
        setViewStatisticEndpoint('api/v1/pages/routes/time/per-view')
        setViewStatisticHeadings(['Route', 'Average Time on Page'])
        setViewStatisticItemKeys(['id', 'route', 'time_per_view'])
        setViewStatisticShouldFormatCategories(true)
        break
      case 'unique':
        setViewStatisticCategoriesToFormat([])
        setViewStatisticEndpoint('api/v1/pages/routes/total-unique-views')
        setViewStatisticHeadings(['Route', 'Unique Views'])
        setViewStatisticItemKeys(['id', 'route', 'total_unique_views'])
        setViewStatisticShouldFormatCategories(false)
        break
      case 'default':
      case 'total':
        setViewStatisticCategoriesToFormat([])
        setViewStatisticEndpoint('api/v1/pages/routes/total-views')
        setViewStatisticHeadings(['Route', 'Views'])
        setViewStatisticItemKeys(['id', 'route', 'total_views'])
        setViewStatisticShouldFormatCategories(false)
      break
    }
  }

  const handlePeriodChange = data => {
    const { interval, queryString } = data

    setPeriodInterval(interval)
    setPeriodQueryString(queryString)

    switch (interval) {
      case 'd':
        setTimeSeriesCategoryKey('day')
        setTimeSeriesCategoryName('Days')
        setTimeSeriesDateLabelFormatOptions({ month: 'numeric', day: 'numeric' })
        setTimeSeriesDateRangeFormatOptions({ month: 'long', day: 'numeric' })
        setTimeSeriesEndpointInterval('by-day')
        setTimeSeriesIntervalFormatted('Day')
        setTimeSeriesStatisticKey('totalViewsByDay')
        setTimeSeriesStatisticTimeKey('day')
        break
      case 'h':
        setTimeSeriesCategoryKey('hour')
        setTimeSeriesCategoryName('Hours')
        setTimeSeriesDateLabelFormatOptions({ hour: 'numeric' })
        setTimeSeriesDateRangeFormatOptions({ month: 'long', day: 'numeric', hour: 'numeric' })
        setTimeSeriesEndpointInterval('by-hour')
        setTimeSeriesIntervalFormatted('Hour')
        setTimeSeriesStatisticKey('totalViewsByHour')
        setTimeSeriesStatisticTimeKey('hour')
        break
      case 'm':
        setTimeSeriesCategoryKey('month')
        setTimeSeriesCategoryName('Months')
        setTimeSeriesDateLabelFormatOptions({ month: 'short' })
        setTimeSeriesDateRangeFormatOptions({ month: 'long', year: 'numeric' })
        setTimeSeriesEndpointInterval('by-month')
        setTimeSeriesIntervalFormatted('Month')
        setTimeSeriesStatisticKey('totalViewsByMonth')
        setTimeSeriesStatisticTimeKey('month')
        break
    }
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
      <Grid container rowSpacing={2} columnSpacing={{ sm:0, md: 10 }} sx={{ mb: '2rem', pt: '7rem'}}>
        <Grid xs={12} sm={6} md={9}>
          <div className="selected-site-title">
            nocargravel.cc
          </div>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <SelectPeriod
            id="content-statistics-period"
            initialPeriod="forever"
            labeltext="period"
            onSelect={handlePeriodChange}
          />
        </Grid>
      </Grid>
      <Grid container rowSpacing={2} columnSpacing={{ sm: 0, md: 10}}>
        <Grid size={12}>
          <LayoutTimeSeries
            apiKeyRead={apiKeyRead}
            baseAnalyticsApiUrl={baseAnalyticsApiUrl}
            categoryKey={timeSeriesCategoryKey}
            categoryName={timeSeriesCategoryName}
            chartSize={chartSize}
            chartType='line'
            dateLabelFormatOptions={timeSeriesDateLabelFormatOptions}
            dateRangeFormatOptions={timeSeriesDateRangeFormatOptions}
            endpoint={`api/v1/pages/${timeSeriesEndpointInterval}`}
            queryString={periodQueryString}
            seriesName="Views"
            source="No Car Gravel"
            statisticKey={timeSeriesStatisticKey}
            statisticTimeKey={timeSeriesStatisticTimeKey}
            statisticValueKey="count"
            title={`Page Views by ${timeSeriesIntervalFormatted}`}
          />
        </Grid>
      </Grid>
      <Grid container rowSpacing={2} columnSpacing={{ sm:0, md: 10 }}>
        <Grid xs={12}>
          <div className="widget-statistics-title">
            Content Statistics
          </div>
        </Grid>
        <Grid xs={6} md={4} lg={3} xl={2}>
          <WidgetStatistics
            apiKeyRead={apiKeyRead}
            baseAnalyticsApiUrl={baseAnalyticsApiUrl}
            endpoint="api/v1/pages"
            queryString={periodQueryString}
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
            queryString={periodQueryString}
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
            queryString={periodQueryString}
            statisticChangeKey="timePerPageviewChange"
            statisticFormat="elapsedTime"
            statisticKey="timePerPageview"
            statisticName="Time Per Pageview"
          />
        </Grid>
      </Grid>
      <Grid container rowSpacing={2} columnSpacing={{ sm:0, md: 10 }}>
        <Grid xs={12} md={6}>
          <div className="top-table">
            <LayoutTable
              apiKeyRead={apiKeyRead}
              baseAnalyticsApiUrl={baseAnalyticsApiUrl}
              categoriesToFormat={viewStatisticCategoriesToFormat}
              dateRangeFormatOptions={timeSeriesDateRangeFormatOptions}
              endpoint={viewStatisticEndpoint}
              hasChildren={true}
              headings={viewStatisticHeadings}
              itemKeys={viewStatisticItemKeys}
              queryString={periodQueryString}
              shouldFormatCategories={viewStatisticShouldFormatCategories}
              source="No Car Gravel"
              subtitle="-auto"
              tableType="basic"
              title="Top Routes"
            >
              <ToolbarOptions
                handleClick={handleViewStatisticChange}
                options={
                  [
                    { 'id': 1, 'option': 'Total Views', 'value': 'total' },
                    { 'id': 2, 'option': 'Unique Views', 'value': 'unique' }, 
                    { 'id': 3, 'option': 'Avg. Time', 'value': 'average' }
                  ]
                }
              />
            </LayoutTable>
          </div>
        </Grid>
        <Grid xs={12} md={6}>
          <div className="top-table">
            {/* <LayoutTable
              apiKeyRead={apiKeyRead}
              baseAnalyticsApiUrl={baseAnalyticsApiUrl}
              categoriesToFormat={[{ 'category': 'language', 'format': 'languageName' }]}
              dateRangeFormatOptions={timeSeriesDateRangeFormatOptions}
              endpoint="api/v1/sessions/languages"
              headings={['Languages', 'Visitors']}
              itemKeys={['id', 'language', 'count']}
              queryString={periodQueryString}
              shouldFormatCategories={true}
              statisticKey="languages"
              statisticKeyDateRange="language"
              subtitle="-auto"
              source="No Car Gravel"
              tableType="basic"
              title="Top Languages"
            /> */}
          </div>
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
