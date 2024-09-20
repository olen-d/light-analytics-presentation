import { useEffect, useState } from 'react'

import useFetchData from '../hooks/useFetchData'

import ChartLine from '../components/ChartLine'
import LayoutChart from '../components/LayoutChart'
import SubtitleChart from '../components/SubtitleChart'

import { Unstable_Grid2 as Grid } from '@mui/material'

// Begin Table Stuff
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from'@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
// End Table Stuff

const apiKeyRead = import.meta.env.VITE_ANALYTICS_API_KEY_READ
const baseAnalyticsApiUrl = import.meta.env.VITE_ANALYTICS_API_BASE_URL

const VisitorsView = () => {
  const [chartSize, setChartSize] = useState(null)

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

  const MonthlyVisitsSummary = () => {
    const url = `${baseAnalyticsApiUrl}/api/v1/sessions/summary/by-month`
    const requestConfig = {
      apiKey: apiKeyRead,
      method: 'GET',
      url
    }

    const { fetchResult, isLoading, error } = useFetchData(requestConfig)
    if (isLoading) {
      return 'Loading...'
    } else {
      const { data: { summaryByMonth } } = fetchResult

      const headings = [
        'Month',
        'Total Visits',
        'Unique Visits',
        'Single Page Sessions',
        'Bounce Rate'
      ]

      const formatMonth = m => {
        const [year, month] = m.split('-')
        const monthJsDate = new Date(year, Number(month) -1)

        const monthOptions = month === '01' ? { month: 'long', year: 'numeric' } : { month: 'long' }
        const monthFormat = new Intl.DateTimeFormat('en-US', monthOptions)
        const monthFormatted = monthFormat.format(monthJsDate)

        return monthFormatted
      }

      const rows = summaryByMonth.map(element => {
        const { month, totalVisits, uniqueVisits, singlePageSessions, bounceRate } = element
        const monthFormatted = formatMonth(month)
        const bounceRateFormatted = `${Math.round(bounceRate * 100)}%` 
        return({ id: month, monthFormatted, totalVisits, uniqueVisits, singlePageSessions, bounceRateFormatted })
      })

      return (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
              {headings.map((element, index) => (
                <TableCell key={index} align="center">{element}</TableCell>
              ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(element => (
                <TableRow
                  key={element.id}
                >
                  <TableCell component="th" scope="row">
                    {element.monthFormatted}
                  </TableCell>
                  <TableCell align="right">{element.totalVisits}</TableCell>
                  <TableCell align="right">{element.uniqueVisits}</TableCell>
                  <TableCell align="right">{element.singlePageSessions}</TableCell>
                  <TableCell align="right">{element.bounceRateFormatted}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )
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
      <MonthlyVisitsSummary />
    </div>
  )
}

export default VisitorsView
