import { useEffect, useState } from 'react'

import LayoutTimeSeries from '../components/LayoutTimeSeries'
import LayoutTable from '../components/LayoutTable'
import SelectPeriod from '../components/SelectPeriod'
import WidgetStatistics from '../components/WidgetStatistics'

import { Unstable_Grid2 as Grid, Table } from '@mui/material'

const apiKeyRead = import.meta.env.VITE_ANALYTICS_API_KEY_READ
const baseAnalyticsApiUrl = import.meta.env.VITE_ANALYTICS_API_BASE_URL

const VisitorsView = () => {
  const [chartSize, setChartSize] = useState(null)
  const [periodInterval, setPeriodInterval] = useState('')
  const [periodQueryString, setPeriodQueryString] = useState('')
  const [timeSeriesCategoryKey, setTimeSeriesCategoryKey] = useState('month')
  const [timeSeriesCategoryName, setTimeSeriesCategoryName] = useState('Months')
  const [timeSeriesDateLabelFormatOptions, setTimeSeriesDateLabelFormatOptions] = useState({ month: 'short' })
  const [timeSeriesDateRangeFormatOptions, setTimeSeriesDateRangeFormatOptions] = useState({ month: 'long', year: 'numeric' })
  const [timeSeriesEndpointInterval, setTimeSeriesEndpointInterval] = useState('by-month')
  const [timeSeriesIntervalFormatted, setTimeSeriesIntervalFormatted] = useState('Month')
  const [timeSeriesStatisticKey, setTimeSeriesStatisticKey] = useState('totalVisitsByMonth')
  const [timeSeriesStatisticTimeKey, setTimeSeriesStatisticTimeKey] = useState('month')

  // const MonthlyVisitsSummary = () => {
  //   const url = `${baseAnalyticsApiUrl}/api/v1/sessions/summary/by-month`
  //   const requestConfig = {
  //     apiKey: apiKeyRead,
  //     method: 'GET',
  //     url
  //   }

  //   const { fetchResult, isLoading, error } = useFetchData(requestConfig)
  //   if (isLoading) {
  //     return 'Loading...'
  //   } else {
  //     const { data: { summaryByMonth } } = fetchResult

  //     const headings = [
  //       'Month',
  //       'Total Visits',
  //       'Unique Visits',
  //       'Single Page Sessions',
  //       'Bounce Rate'
  //     ]

  //     const formatMonth = m => {
  //       const [year, month] = m.split('-')
  //       const monthJsDate = new Date(year, Number(month) -1)

  //       const monthOptions = { month: 'long', year: 'numeric' }
  //       const monthFormat = new Intl.DateTimeFormat('en-US', monthOptions)
  //       const monthFormatted = monthFormat.format(monthJsDate)

  //       return monthFormatted
  //     }

  //     const rowKeys = summaryByMonth.map(element => {
  //       const { month: key } = element
  //       return key
  //     })

  //     const rows = summaryByMonth.map(element => {
  //       const { month, totalVisits, uniqueVisits, singlePageSessions, bounceRate } = element
  //       const monthFormatted = formatMonth(month)
  //       const bounceRateFormatted = `${Math.round(bounceRate * 100)}%` 
  //       return([month, monthFormatted, totalVisits, uniqueVisits, singlePageSessions, bounceRateFormatted])
  //     })

  //     return(<TableSort headings={headings} rows={rows} isFirstColVisible={false} rowKeys={rowKeys} />)
  //   }
  // }
 
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
        setTimeSeriesStatisticKey('totalVisitsByDay')
        setTimeSeriesStatisticTimeKey('day')
        break
      case 'h':
        setTimeSeriesCategoryKey('hour')
        setTimeSeriesCategoryName('Hours')
        setTimeSeriesDateLabelFormatOptions({ hour: 'numeric' })
        setTimeSeriesDateRangeFormatOptions({ month: 'long', day: 'numeric', hour: 'numeric' })
        setTimeSeriesEndpointInterval('by-hour')
        setTimeSeriesIntervalFormatted('Hour')
        setTimeSeriesStatisticKey('totalVisitsByHour')
        setTimeSeriesStatisticTimeKey('hour')
        break
      case 'm':
        setTimeSeriesCategoryKey('month')
        setTimeSeriesCategoryName('Months')
        setTimeSeriesDateLabelFormatOptions({ month: 'short' })
        setTimeSeriesDateRangeFormatOptions({ month: 'long', year: 'numeric' })
        setTimeSeriesEndpointInterval('by-month')
        setTimeSeriesIntervalFormatted('Month')
        setTimeSeriesStatisticKey('totalVisitsByMonth')
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
    <div className='visitors-view'>
      <Grid container rowSpacing={2} columnSpacing={{ sm:0, md: 10 }} sx={{ mb: '2rem', pt: '7rem'}}>
        <Grid xs={12} sm={6} md={9}>
          <div className="selected-site-title">
            nocargravel.cc
          </div>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <SelectPeriod
            id="visitor-statistics-period"
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
            endpoint={`api/v1/sessions/${timeSeriesEndpointInterval}`}
            queryString={periodQueryString}
            seriesName="Visits"
            source="No Car Gravel"
            statisticKey={timeSeriesStatisticKey}
            statisticTimeKey={timeSeriesStatisticTimeKey}
            statisticValueKey="count"
            title={`Visits by ${timeSeriesIntervalFormatted}`}
          />
        </Grid>
      </Grid>

      {/* <MonthlyVisitsSummary /> */}
      <Grid container rowSpacing={2} columnSpacing={{ sm:0, md: 10 }}>
        <Grid xs={12}>
          <div className="widget-statistics-title">
            Visitor Statistics
          </div>
        </Grid>
        <Grid xs={6} md={4} lg={3} xl={2}>
          <WidgetStatistics
            apiKeyRead={apiKeyRead}
            baseAnalyticsApiUrl={baseAnalyticsApiUrl}
            endpoint="api/v1/sessions"
            queryString={periodQueryString}
            statisticChangeKey="totalVisitsChange"
            statisticKey="totalVisits"
            statisticName="Total Visits"
          />
        </Grid>
        <Grid xs={6} md={4} lg={3} xl={2}>
          <WidgetStatistics
            apiKeyRead={apiKeyRead}
            baseAnalyticsApiUrl={baseAnalyticsApiUrl}
            endpoint="api/v1/sessions/unique"
            queryString={periodQueryString}
            statisticChangeKey="uniqueVisitsChange"
            statisticKey="uniqueVisits"
            statisticName="Unique Visits"
          />
        </Grid>
        <Grid xs={6} md={4} lg={3} xl={2}>
          <WidgetStatistics
            apiKeyRead={apiKeyRead}
            baseAnalyticsApiUrl={baseAnalyticsApiUrl}
            endpoint="api/v1/pages/time-on-pages/average"
            queryString={periodQueryString}
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
            endpoint="api/v1/sessions/bounce-rate"
            reverseChangeColors={true}
            queryString={periodQueryString}
            statisticChangeKey={"bounceRateChange"}
            statisticFormat="percent"
            statisticKey="bounceRate"
            statisticName="Bounce Rate"
          />
        </Grid> 
      </Grid>
      <Grid container rowSpacing={2} columnSpacing={{ sm:0, md: 10 }}>
        <Grid xs={12} md={6}>
          <div className="top-table">
            <LayoutTable
              apiKeyRead={apiKeyRead}
              baseAnalyticsApiUrl={baseAnalyticsApiUrl}
              dateRangeFormatOptions={timeSeriesDateRangeFormatOptions}
              endpoint="api/v1/sessions/referrers"
              headings={['Referrers', 'Visitors']}
              itemKeys={['id', 'referrer', 'count']}
              queryString={periodQueryString}
              statisticKey="referrers"
              statisticKeyDateRange="referrer"
              subtitle="-auto"
              source="No Car Gravel"
              tableType="basic"
              title="Top Referrers"
            />
          </div>
        </Grid>
        <Grid xs={12} md={6}>
          <div className="top-table">
            <LayoutTable
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
            />
          </div>
        </Grid> 
      </Grid>
    </div>
  )
}

export default VisitorsView
