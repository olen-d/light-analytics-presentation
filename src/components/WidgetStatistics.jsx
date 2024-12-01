import { PropTypes } from 'prop-types'

import useFetchData from '../hooks/useFetchData'

import DisplayStatisticNumber from './DisplayStatisticNumber'

const WidgetStatistics = ({
  apiKeyRead,
  baseAnalyticsApiUrl,
  endpoint,
  reverseChangeColors,
  round,
  statisticChangeKey,
  statisticFormat = 'none',
  statisticKey,
  statisticName
}) => {
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
      const statisticValue = fetchResult.data[statisticKey]
      const statisticChange = fetchResult.data[statisticChangeKey]
      const { data: { startDate, endDate }, } = fetchResult

      const offset = new Date().getTimezoneOffset()
      let endDateProcessed = endDate
      let startDateProcessed = startDate

      if (!endDate.includes('T')) {
        endDateProcessed = new Date(endDate)
        endDateProcessed.setMinutes(endDateProcessed.getMinutes() + offset)
      }

      if (!startDate.includes('T')) {
        startDateProcessed = new Date(startDate)
        startDateProcessed.setMinutes(startDateProcessed.getMinutes() + offset)
      }

      return(
        <DisplayStatisticNumber
          endDate={endDateProcessed}
          format={statisticFormat}
          reverseChangeColors={reverseChangeColors}
          round={round}
          startDate={startDateProcessed}
          statisticName={statisticName}
          statisticValue={statisticValue}
          statisticChange={statisticChange}
        />
      )
    }
  }
}

const { bool, number, string } = PropTypes

WidgetStatistics.propTypes = {
  apiKeyRead: string,
  baseAnalyticsApiUrl: string,
  endpoint: string,
  reverseChangeColors: bool,
  round: number,
  statisticChangeKey: string,
  statisticFormat: string,
  statisticKey: string,
  statisticName: string
}

export default WidgetStatistics
