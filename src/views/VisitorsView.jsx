import { useEffect, useState } from 'react'

import useFetchData from '../hooks/useFetchData'

import ChartLine from '../components/ChartLine'
import LayoutChart from '../components/LayoutChart'
import SelectGeneric from '../components/form-fields/SelectGeneric'
import SubtitleChart from '../components/SubtitleChart'
import TableBasic from '../components/TableBasic'
import WidgetStatistics from '../components/WidgetStatistics'

import { Unstable_Grid2 as Grid } from '@mui/material'

const apiKeyRead = import.meta.env.VITE_ANALYTICS_API_KEY_READ
const baseAnalyticsApiUrl = import.meta.env.VITE_ANALYTICS_API_BASE_URL

const VisitorsView = () => {
  const [chartSize, setChartSize] = useState(null)
  const [visitStatsPeriod, setVisitStatsPeriod] = useState('forever')
  const [widgetQueryString, setWidgetQueryString] = useState('')

  const formatDateJs = date => {
    const dayJs = date.getDate()
    const monthJs = date.getMonth() + 1
    const day = dayJs.toString().padStart(2, '0')
    const month = monthJs.toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${year}-${month}-${day}`
  }

  const MonthlyVisits = () => {

    const url = `${baseAnalyticsApiUrl}/api/v1/sessions/by-month`
    const requestConfig = {
      apiKey: apiKeyRead,
      method: 'GET',
      url
    }

    const { fetchResult, isLoading, error } = useFetchData(requestConfig)
    if (isLoading) {
      return 'Loading...'
    } else {
      const { data: { totalVisitsByMonth : tvbm } } = fetchResult

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
    
      const totalVisitsByMonthFinal = tvbm.map(item => {
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
            chartData={totalVisitsByMonthFinal}
            chartSize={chartSize}
            seriesName='Visits'
            startFromValue={0}
          />
        </>
      )
    }
  }

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
 
  const CountTable = ({
    endpoint,
    countKey,
    countName,
    itemKey,
    itemName,
    itemNameFormat = 'none',
    listKey
  }) => {
    const formatItemName = item => {
      let itemNameFormatted = null

      switch (itemNameFormat) {
        case 'language':
          const languageNames = new Intl.DisplayNames(['eng'], { type: 'language' })
          itemNameFormatted = languageNames.of(item)
          break
        case 'none':
        default:
          itemNameFormatted = item
      }

      return itemNameFormatted
    }

    const url = `${baseAnalyticsApiUrl}/${endpoint}`

    const requestConfig = {
      apiKey: apiKeyRead,
      method: 'GET',
      url
    }

    const { fetchResult, isLoading, error } = useFetchData(requestConfig)
    if (isLoading) {
      return 'Loading...'
    } else {
      if (fetchResult.status === 'ok') {
        const headings = [itemName, countName]
        const rowsData = fetchResult.data[listKey]

        const rowKeys = rowsData.map(element => {
          return element[itemKey]
        })

        const rows = rowsData.map(element => {
          const item = element[itemKey]
          const itemFormatted = formatItemName(item)
          const count = element[countKey]
          return [itemFormatted, count]
        })

        return(<TableBasic headings={headings} rows={rows} rowKeys={rowKeys} />)
      }
    }
  }

  const handleChangeOptionsStatisticsVisits = event => {
    const { target: { value: selectValue }, } = event

    setVisitStatsPeriod(selectValue)

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

  const optionsStatisticsVisits = [
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
    <div className='visitors-view'>
      <h1 className="admin-lead extended">Administration &raquo; Visitors</h1>
      <Grid container rowSpacing={2} columnSpacing={{ sm: 0, md: 10}}>
        <Grid size={12}>
          <LayoutChart
            chart={MonthlyVisits}
            source="No Car Gravel"
            title="Visits by Month"
          />
        </Grid>
      </Grid>
      {/* <MonthlyVisitsSummary /> */}
      <Grid container rowSpacing={2} columnSpacing={{ sm:0, md: 10 }}>
        <Grid xs={12} sm={6} md={9}>
          <div className="widget-statistics-title">
            Visitor Statistics
          </div>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <div className="widget-statistics-select-period">
            <SelectGeneric
              handleChange={handleChangeOptionsStatisticsVisits}
              id='select-generic-statistics-visits-period'
              initialValue={visitStatsPeriod}
              labelId='select-generic-statistics-visits-period-label'
              labeltext="Period"
              options={optionsStatisticsVisits}
            />
          </div>
        </Grid>
        <Grid xs={6} md={4} lg={3} xl={2}>
          <WidgetStatistics
            apiKeyRead={apiKeyRead}
            baseAnalyticsApiUrl={baseAnalyticsApiUrl}
            endpoint="api/v1/sessions"
            queryString={widgetQueryString}
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
            queryString={widgetQueryString}
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
            queryString={widgetQueryString}
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
            queryString={widgetQueryString}
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
            <div className="table-text-title">
              Top Referrers
            </div>
            <CountTable
              endpoint="api/v1/sessions/referrers"
              countKey="count"
              countName="Visitors"
              itemKey="referrer"
              itemName="Referrers"
              listKey="referrers"
            />
          </div>
        </Grid>
        <Grid xs={12} md={6}>
          <div className="top-table">
            <div className="table-text-title">
              Top Languages
            </div>
            <CountTable
              endpoint="api/v1/sessions/languages"
              countKey="count"
              countName="Visitors"
              itemKey="language"
              itemName="Languages"
              itemNameFormat="language"
              listKey="languages"
            />
          </div>
        </Grid> 
      </Grid>
    </div>
  )
}

export default VisitorsView
