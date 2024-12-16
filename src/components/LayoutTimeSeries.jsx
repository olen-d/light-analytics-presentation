import { PropTypes } from 'prop-types'

import useFetchData from '../hooks/useFetchData'

import ChartColumn from './ChartColumn'
import LayoutChartChildren from './LayoutChartChildren'

const LayoutTimeSeries = ({
  apiKeyRead,
  baseAnalyticsApiUrl,
  endpoint,
  dateLabelFormatOptions,
  dateRangeFormatOptions,
  queryString = '',
  source,
  statisticKey,
  statisticTimeKey,
  statisticValueKey,
  title,
  valueFormatOptions
}) => {
  const formatDate = (dateObj, options) => {
    const dateTimeFormat = new Intl.DateTimeFormat('en-US', options)
    const dateFormatted = dateTimeFormat.format(dateObj)
    return dateFormatted
  }

  const formatDateMySql = dateObj => {
    const dayRaw = dateObj.getDate()
    const monthRaw = dateObj.getMonth() + 1
    const day = dayRaw.toString().padStart(2, '0')
    const month = monthRaw.toString().padStart(2, '0')
    const year = dateObj.getFullYear()
    return `${year}-${month}-${day}`
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

  const url = `${baseAnalyticsApiUrl}/${endpoint}${queryString}`

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

      switch (statisticTimeKey) {
        case 'day':
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

          timesInPeriod.push(formatDateMySql(lastObj))
          for(let i=0; i < range; i++) {
            lastObj.setDate(lastObj.getDate() + 1)
            const last = formatDateMySql(lastObj)
            timesInPeriod.push(last)
          }
          break
      }

      const seriesWithZeros = timesInPeriod.map(item => {
        const index = series.findIndex(t => t[statisticTimeKey] === item)
        return index === -1 ? { [statisticTimeKey]: item, [statisticValueKey]: 0} : series[index]
      })

      const seriesWithZerosFormatted = seriesWithZeros.map(item => {
        const dateStr = item[statisticTimeKey]
        const value = item[statisticValueKey]

        const dayParts = dateStr.split('-')
        const dateObj = new Date(dayParts[0], dayParts[1] -1, dayParts[2])
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
            <ChartColumn
              categoryName='Days'
              categoryKey='day'
              chartData={seriesWithZerosFormatted}
              seriesName='Visits'
              startFromValue={0}
              valueKey={statisticValueKey}
            />
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
  endpoint: string,
  dateFormatOptions: object,
  dateRangeFormatOptions: object,
  queryString: string,
  source: string,
  statisticKey: string,
  statisticTimeKey: string,
  statisticValueKey: string,
  title: string,
  valueFormatOptions: string
}

export default LayoutTimeSeries
