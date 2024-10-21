'use strict'

import { PropTypes } from 'prop-types'

const DisplayStatisticNumber = ({
  endDate,
  format = 'none',
  round = 0,
  startDate,
  statisticName = 'Name',
  statisticValue = 0
}) => {
  const converted = () => {
    switch (format) {
      case 'percent':
        return statisticValue * 100
      default:
        return statisticValue
    }
  }

  const rounded = () => {
    switch (round) {
      case 0:
        return Math.round(converted())
      default:
        return converted()
    }
  }

  const formatted = () => {
    switch (format) {
      case 'percent':
        return `${rounded()}%`
      case 'none':
      default:
        return rounded()
    }
  }

  const formatDate = dateStr => {
    const jsDate = new Date(dateStr)

    const dateOptions = { day: 'numeric', month: 'short', year: 'numeric' }
    const dateFormat = new Intl.DateTimeFormat('en-US', dateOptions)
    const dateFormatted = dateFormat.format(jsDate)

    return dateFormatted
  }

  const formattedStartDate = () => {
    return formatDate(startDate)
  }

  const formattedEndDate = () => {
    return formatDate(endDate)
  }

  const rangeSeparator = 'to '

  return(
    <>
      <div className='display-statistic-number'>
        <div className='display-statistic-number-name'>
          {statisticName}
        </div>
        <div className='display-statistic-number-value'>
          {formatted()}
        </div>
        <div className='display-statistic-number-date-range'>
          {startDate && formattedStartDate()} { startDate && endDate && rangeSeparator } {endDate && formattedEndDate()}
        </div>
      </div>
    </>
  )
}

const { number, string } = PropTypes

DisplayStatisticNumber.propTypes = {
  format: string,
  round: number,
  statisticName: string,
  statisticValue: number
}

export default DisplayStatisticNumber
