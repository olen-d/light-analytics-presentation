import useFetchData from '../hooks/useFetchData'

import DisplayStatisticNumber from './DisplayStatisticNumber'

const WidgetStatistics = ({
  apiKeyRead,
  baseAnalyticsApiUrl,
  endpoint,
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
          startDate={startDateProcessed}
          statisticName={statisticName}
          statisticValue={statisticValue}
        />
      )
    }
  }
}

export default WidgetStatistics
