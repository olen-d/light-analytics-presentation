import { PropTypes } from 'prop-types'

import useFetchData from '../hooks/useFetchData'

import ChartColumn from './ChartColumn'
import ChartLine from './ChartLine'
import LayoutChartChildren from './LayoutChartChildren'

const LayoutTimeSeries = ({
  apiKeyRead,
  baseAnalyticsApiUrl,
  categoryKey,
  categoryName,
  chartSize,
  chartType = 'column',
  dateLabelFormatOptions,
  dateRangeFormatOptions,
  endpoint,
  queryString = '',
  seriesName,
  source,
  statisticKey,
  statisticTimeKey,
  statisticValueKey,
  title,
  valueFormatOptions
}) => {
  const url = `${baseAnalyticsApiUrl}/${endpoint}${queryString}`

  const requestConfig = {
    apiKey: apiKeyRead,
    method: 'GET',
    url
  }

  const formatDate = (dateObj, options) => {
    const dateTimeFormat = new Intl.DateTimeFormat('en-US', options)
    const dateFormatted = dateTimeFormat.format(dateObj)
    return dateFormatted
  }

  const formatDateMySql = (dateObj, period) => {
    const dayRaw = dateObj.getDate()
    const hoursRaw = dateObj.getHours()
    const hours = hoursRaw.toString().padStart(2, '0')
    const monthRaw = dateObj.getMonth() + 1
    const day = dayRaw.toString().padStart(2, '0')
    const month = monthRaw.toString().padStart(2, '0')
    const year = dateObj.getFullYear()
    if (period === 'day') {
      return `${year}-${month}-${day}`
    } else if (period === 'hour') {
      return `${year}-${month}-${day}H${hours}`
    } else if (period === 'month') {
      return `${year}-${month}`
    }
  }

  const formatValue = value => {
    let valueFormatted = value

    switch (valueFormatOptions) {
      case "microsecondsToMinutes":
        valueFormatted = value / 60000
        break
    }
    return valueFormatted
  }

  const { fetchResult, isLoading, error } = useFetchData(requestConfig) ?? {}
  if (isLoading) {
    return 'Loading...'
  } else {
    if (fetchResult && fetchResult.status === 'ok' && fetchResult.data[statisticKey] !== -99) {
      const series = fetchResult.data[statisticKey]
      const timesInPeriod = []

      let endDate = null
      let startDate = null

      let endDateHumanReadable = null
      let startDateHumanReadable = null

      if (queryString) {
        const searchParams = new URLSearchParams(queryString)
        endDate = searchParams.get('enddate')
        startDate = searchParams.get('startdate')
      } else {
        const offset = series.length - 1
        endDate = series[offset][statisticTimeKey]
        startDate = series[0][statisticTimeKey]
      }

      if (statisticTimeKey === 'day') {
        const endDateParts = endDate.split('-')
        const [ey, em, ed] = endDateParts
        const endDateObj = new Date(ey, em - 1, ed)
        const endDateTimestamp = endDateObj.getTime()
        endDateHumanReadable = formatDate(endDateObj, dateRangeFormatOptions)
  
        const startDateParts = startDate.split('-')
        const [sy, sm, sd] = startDateParts
        const startDateObj = new Date(sy, sm - 1, sd)
        const startDateTimestamp = startDateObj.getTime()
        startDateHumanReadable = formatDate(startDateObj, dateRangeFormatOptions)

        const range = (endDateTimestamp - startDateTimestamp) / (3600000 * 24)
        const lastObj = startDateObj

        timesInPeriod.push(formatDateMySql(lastObj, statisticTimeKey))
        for(let i=0; i < range; i++) {
          lastObj.setDate(lastObj.getDate() + 1)
          const last = formatDateMySql(lastObj, statisticTimeKey)
          timesInPeriod.push(last)
        }
      } else if (statisticTimeKey === 'hour') {
        const endDateDateTimeParts = endDate.split('T')
        const [endDateDate, endDateTime] = endDateDateTimeParts
        const endDateDateParts = endDateDate.split('-')
        const [ey, em, ed] = endDateDateParts
        const endDateTimeParts = endDateTime.split(':')
        const [eh, en] = endDateTimeParts
        const endDateObj = new Date(ey, em -1, ed, eh, en)
        const endDateTimestamp = endDateObj.getTime()
        endDateHumanReadable = formatDate(endDateObj, dateRangeFormatOptions)

        const startDateDateTimeParts = startDate.split('T')
        const [startDateDate, startDateTime] = startDateDateTimeParts
        const startDateDateParts = startDateDate.split('-')
        const [sy, sm, sd] = startDateDateParts
        const startDateTimeParts = startDateTime.split(':')
        const [sh, sn] = startDateTimeParts
        const startDateObj = new Date(sy, sm -1, sd, sh, sn)
        const startDateTimestamp = startDateObj.getTime()
        startDateHumanReadable = formatDate(startDateObj, dateRangeFormatOptions)

        const range = (endDateTimestamp - startDateTimestamp) / (3600000)
        const lastObj = startDateObj

        timesInPeriod.push(formatDateMySql(lastObj, statisticTimeKey))

        for(let i=0; i < range; i++) {
          lastObj.setHours(lastObj.getHours() + 1)
          const last = formatDateMySql(lastObj, statisticTimeKey)
          timesInPeriod.push(last)
        }
      } else if (statisticTimeKey === 'month') {
        const endDateParts = endDate.split('-')
        const [ey, em] = endDateParts
        const endDateObj = new Date(ey, em - 1, 1)
        endDateHumanReadable = formatDate(endDateObj, dateRangeFormatOptions)

        const startDateParts = startDate.split('-')
        const [sy, sm] = startDateParts
        const startDateObj = new Date(sy, sm - 1, 1)
        startDateHumanReadable = formatDate(startDateObj, dateRangeFormatOptions)

        const endMonthTotal = 12 * (Number(ey) - Number(sy)) + Number(em)
        const range = endMonthTotal - Number(sm)
        const lastObj = startDateObj

        timesInPeriod.push(formatDateMySql(lastObj, statisticTimeKey))

        for(let i=0; i < range; i++) {
          lastObj.setMonth(lastObj.getMonth() + 1)
          const last = formatDateMySql(lastObj, statisticTimeKey)
          timesInPeriod.push(last)
        }
      }

      const seriesWithZeros = timesInPeriod.map(item => {
        const index = series.findIndex(t => t[statisticTimeKey] === item)
        return index === -1 ? { [statisticTimeKey]: item, [statisticValueKey]: 0} : series[index]
      })

      const seriesWithZerosFormatted = seriesWithZeros.map(item => {
        const dateStr = item[statisticTimeKey]
        const value = item[statisticValueKey]

        const dayParts = statisticTimeKey === 'hour' ? dateStr.split('H') : dateStr.split('-')

        let dateObj = null
        if (statisticTimeKey === 'day') {
          dateObj = new Date(dayParts[0], dayParts[1] -1, dayParts[2])
        } else if (statisticTimeKey === 'hour') {
          const [dateString, hour] = dayParts
          const dateParts = dateString.split('-')
          dateObj = new Date(dateParts[0], dateParts[1] -1, dateParts[2], hour)
        } else if (statisticTimeKey === 'month') {
          dateObj = new Date(dayParts[0], dayParts[1] -1, 1)
        }
        const dateFormatted = formatDate(dateObj, dateLabelFormatOptions)

        return { [statisticTimeKey]: dateFormatted, [statisticValueKey]: formatValue(value)}
      })

      return(
        <>
          <LayoutChartChildren
            source={source}
            subtitle={`${startDateHumanReadable} to ${endDateHumanReadable}`}
            title={title}
          >
            {
              chartType === 'column' &&
              <ChartColumn
                categoryName='Days'
                categoryKey={categoryKey}
                chartData={seriesWithZerosFormatted}
                seriesName={seriesName}
                startFromValue={0}
                valueKey={statisticValueKey}
              />
            }
            {
              chartType === 'line' &&
              <ChartLine
                categoryName={categoryName}
                categoryKey={categoryKey}
                chartData={seriesWithZerosFormatted}
                chartSize={chartSize}
                seriesName='Visits'
                startFromValue={0}
              />
            }
          </LayoutChartChildren>
        </>
      )
    }
  }
}

const { object, string } = PropTypes

LayoutTimeSeries.propTypes = {
  apiKeyRead: string,
  baseAnalyticsApiUrl: string,
  categoryKey: string,
  categoryName: string,
  chartSize: string,
  chartType: string,
  dateLabelFormatOptions: object,
  dateRangeFormatOptions: object,
  endpoint: string,
  queryString: string,
  seriesName: string,
  source: string,
  statisticKey: string,
  statisticTimeKey: string,
  statisticValueKey: string,
  title: string,
  valueFormatOptions: string
}

export default LayoutTimeSeries
