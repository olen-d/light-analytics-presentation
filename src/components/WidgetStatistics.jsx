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

      return(
        <DisplayStatisticNumber
          endDate={endDate}
          format={statisticFormat}
          startDate={startDate}
          statisticName={statisticName}
          statisticValue={statisticValue}
        />
      )
    }
  }
}

export default WidgetStatistics
