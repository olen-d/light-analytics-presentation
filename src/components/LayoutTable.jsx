import { PropTypes } from 'prop-types'

import useFetchData from '../hooks/useFetchData'

import SourceTable from './SourceTable'
import SubtitleTable from './SubtitleTable'
import TableBasic from './TableBasic'
import TitleTable from './TitleTable'

const LayoutTable = ({
  apiKeyRead,
  baseAnalyticsApiUrl,
  categoriesToFormat,
  children,
  dateRangeFormatOptions,
  endpoint,
  hasChildren = false,
  headings,
  itemKeys,
  queryString,
  shouldFormatCategories = false,
  statisticKey,
  subtitle,
  source,
  tableType = 'basic',
  title
}) => {
  // Helper Functions
  const dateStringToDateObj = (dateString, format) => {
    switch (format) {
      case 'mysql2':
        if (dateString.includes('T')) {
          const dateTimeParts = dateString.split('T')
          const [date, time] = dateTimeParts
          const dateParts = date.split('-')
          const [y, m, d] = dateParts
          const timeParts = time.split(':')
          const [h, n] = timeParts
          const dateObj = new Date(y, m -1, d, h, n)
          return dateObj
        } else {
          const dateParts = dateString.split('-')
          const [y, m, d] = dateParts
          const dateObj = new Date(y, m -1, d)
          return dateObj
        }
        break
    }
  }

  const formatDate = (dateObj, options) => {
    const dateTimeFormat = new Intl.DateTimeFormat('en-US', options)
    const dateFormatted = dateTimeFormat.format(dateObj)
    return dateFormatted
  }
  
  const formatElement = (element, category, format, shouldRound = false, round = 0) => {
    let elementFormatted = null

    switch (format) {
      case 'elapsedTime':
        const totalSeconds = Math.round(element[category] / 1000)
        const hours = Math.floor(totalSeconds / 3600)
        const minutes = Math.floor(totalSeconds / 60) % 60
        const seconds = totalSeconds % 60
        elementFormatted = `${hours > 0 ? hours+'h' : ''} ${minutes > 0 ? minutes+'m' : ''} ${seconds}s`
        break
      case 'languageName':
        const languageNames = new Intl.DisplayNames(['eng'], { type: 'language' })
        elementFormatted = languageNames.of(element[category])
        break
      case 'percent':
        const pct = element[category] * 100
        const pctRounded = shouldRound ? rounded(round, pct) : pct
        elementFormatted = `${pctRounded}%`
        break
      case 'none':
      default:
        elementFormatted = element
    }
    return elementFormatted
  }

  const rounded = (round, value) => {
    const expanded = 10 ** round * value
    const rounded = Math.round(expanded)
    const compressed = 10 ** (round * -1) * rounded
    const fixed = compressed.toFixed(round)
    const float = parseFloat(fixed)
    return float
  }

  // End Helper Functions

  let rows = []
  let subtitleFinal = subtitle

  const url = `${baseAnalyticsApiUrl}/${endpoint}${queryString}`

  const requestConfig = {
    apiKey: apiKeyRead,
    method: 'GET',
    url
  }

  const { fetchResult, isLoading, error } = useFetchData(requestConfig) ?? {}
  if (isLoading) {
    return 'Loading...'
  } else {
    if (fetchResult && fetchResult.status === 'ok' && fetchResult.data[statisticKey] !== -99) {
      const rowsData = statisticKey ? fetchResult.data[statisticKey] : fetchResult.data

      rows = rowsData.map(element => {
        const row = itemKeys.map(itemKey => {
          const categoryIdx = shouldFormatCategories ? categoriesToFormat.findIndex(element => element.category === itemKey) : -1
          return categoryIdx === -1 ? element[itemKey] : formatElement(element, categoriesToFormat[categoryIdx].category, categoriesToFormat[categoryIdx].format, categoriesToFormat[categoryIdx]?.shouldRound, categoriesToFormat[categoryIdx]?.round)
        })
        return row
      })

      if (subtitle === '-auto') {
        let endDate = null
        let startDate = null

        if (queryString) {
          const searchParams = new URLSearchParams(queryString)
          const endDateQueryString = searchParams.get('enddate')
          const startDateQueryString = searchParams.get('startdate')
          const endDateObj = dateStringToDateObj(endDateQueryString, 'mysql2')
          const startDateObj = dateStringToDateObj(startDateQueryString, 'mysql2')
          endDate = formatDate(endDateObj, dateRangeFormatOptions)
          startDate = formatDate(startDateObj, dateRangeFormatOptions)
        } else {
          const { meta: { endDate: endDateMySql2, startDate: startDateMySql2 }, } = fetchResult
          const endDateObj = dateStringToDateObj(endDateMySql2, 'mysql2')
          const startDateObj = dateStringToDateObj(startDateMySql2, 'mysql2')
          endDate = formatDate(endDateObj, dateRangeFormatOptions)
          startDate = formatDate(startDateObj, dateRangeFormatOptions)
        }
        subtitleFinal = `${startDate} to ${endDate}`
      }
    }
  }

  return (
    <div className="layout-table-container">
      <TitleTable title={title} />
      <SubtitleTable subtitle={subtitleFinal} />
      {hasChildren && children}
      {
        tableType === 'basic' &&
        <TableBasic 
        headings={headings}
        rows={rows}
      />
      }
      {source && <SourceTable source={source} />}
    </div>
  )
}

const { array, bool, object, string } = PropTypes

LayoutTable.propTypes = {
  apiKeyRead: string,
  baseAnalyticsApiUrl: string,
  categoriesToFormat: array,
  dateRangeFormatOptions: object,
  endpoint: string,
  headings: array,
  itemKeys: array,
  queryString: string,
  shouldFormatCategories: bool,
  statisticKey: string,
  subtitle: string,
  source: string,
  tableType: string,
  title: string
}

export default LayoutTable
