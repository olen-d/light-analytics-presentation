import { PropTypes } from 'prop-types'

import useFetchData from '../hooks/useFetchData'

import ChartBar from './ChartBar'
import LayoutChartChildren from './LayoutChartChildren'

const LayoutRankedCategories = ({
  apiKeyRead,
  baseAnalyticsApiUrl,
  categoryLabelFormatOptions,
  categoryLaybelLengthLimit = 14,
  categoryLimit = 7,
  endpoint,
  dateRangeFormatOptions,
  queryString = '',
  seriesName,
  shouldLimitCategory = true,
  shouldTruncateCategoryLabel = true,
  source,
  statisticKey,
  statisticCategoryKey,
  statisticValueKey,
  title,
  valueFormatOptions
}) => {
  const formatDate = (dateObj, options) => {
    const dateTimeFormat = new Intl.DateTimeFormat('en-US', options)
    const dateFormatted = dateTimeFormat.format(dateObj)
    return dateFormatted
  }

  const truncateSeries = (values, limit) => {
    return values.slice(0, limit)
  }

  const url = `${baseAnalyticsApiUrl}/${endpoint}${queryString}`

  const requestConfig = {
    apiKey: apiKeyRead,
    method: 'GET',
    url
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

      const seriesLimited = shouldLimitCategory ? truncateSeries(seriesSorted, categoryLimit) : seriesSorted

      const seriesTruncated = seriesLimited.map(item => {
        const { [statisticCategoryKey]: dataLabel, [statisticValueKey]: value } = item
        const dataLabelTruncated = truncateString(dataLabel, categoryLaybelLengthLimit)
        return({ [statisticCategoryKey]: dataLabelTruncated, [statisticValueKey]: value })
      })

      const seriesFinal = shouldTruncateCategoryLabel ? seriesTruncated : seriesLimited

      return(
        <>
          <LayoutChartChildren
            source={source}
            subtitle={`${startDateHumanReadable} to ${endDateHumanReadable}`}
            title={title}
          >
            <ChartBar
              categoryKey={statisticCategoryKey}
              chartData={seriesFinal}
              seriesName='Views'
              startFromValue={0}
              valueKey={statisticValueKey}
            />
          </LayoutChartChildren>
        </>
      )
    }
  }
}

export default LayoutRankedCategories