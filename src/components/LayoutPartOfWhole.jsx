import { PropTypes } from 'prop-types'

import useFetchData from '../hooks/useFetchData'

import ChartPie from './ChartPie'
import LayoutChartChildren from './LayoutChartChildren'

const LayoutPartOfWhole = ({
  apiKeyRead,
  baseAnalyticsApiUrl,
  endpoint,
  dateRangeFormatOptions,
  queryString = '',
  seriesName,
  shouldFormatSlug = false,
  source,
  statisticKey,
  statisticCategoryKey,
  statisticValueKey,
  title,
  valueFormatOptions
}) => {
  const exceededFormatted = values => {
    const categories = values.slice(0,4)
    const others = values.slice(4)

    const otherTotal = others.reduce((sum, { value }) => sum + value, 0)
    categories.push({ dataLabel: 'Other', value: otherTotal})

    return categories
  }

  const formatDate = (dateObj, options) => {
    const dateTimeFormat = new Intl.DateTimeFormat('en-US', options)
    const dateFormatted = dateTimeFormat.format(dateObj)
    return dateFormatted
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
      const series = fetchResult[statisticKey]

      let endDate = null
      let startDate = null

      let endDateHumanReadable = null
      let startDateHumanReadable = null

      if (queryString) {
        const searchParams = new URLSearchParams(queryString)
        endDate = searchParams.get('enddate')
        startDate = searchParams.get('startdate')

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
      } else {
        // TODO: Figure out how to get the start and end dates
      }

      const seriesSorted = series.toSorted((a, b) => {
        return b[statisticValueKey] - a[statisticValueKey]
      })

      const seriesFormatted = seriesSorted.map(item => {
        const dataLabel = shouldFormatSlug ? formatSlug(item[statisticCategoryKey]) : item[statisticCategoryKey]
        const value = item[statisticValueKey]

        return({ dataLabel, value })
      })

      const seriesFinal = seriesFormatted.length > 5 ? exceededFormatted(seriesFormatted) : seriesFormatted

      return(
        <>
          <LayoutChartChildren
            chartColors={['#94fa70', '#00cd9c', '#0095a4', '#006291', '#292f56']}
            chartData={seriesFinal}
            source={source}
            subtitle={`${startDateHumanReadable} to ${endDateHumanReadable}`}
            title={title}
          >
            <ChartPie
              categoryName='Days'
              categoryKey='day'
              chartColors={['#94fa70', '#00cd9c', '#0095a4', '#006291', '#292f56']}
              chartData={seriesFinal}
              seriesName={seriesName}
              startAngle={-90}
              valueKey={statisticValueKey}
            />
          </LayoutChartChildren>
        </>
      )
    }
  }
}

const { object, string } = PropTypes

LayoutPartOfWhole.propTypes = {
  apiKeyRead: string,
  baseAnalyticsApiUrl: string,
  endpoint: string,
  dateRangeFormatOptions: object,
  queryString: string,
  source: string,
  statisticKey: string,
  statisticCategoryKey: string,
  statisticValueKey: string,
  title: string,
  valueFormatOptions: string
}

export default LayoutPartOfWhole
