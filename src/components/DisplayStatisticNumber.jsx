import { PropTypes } from 'prop-types'

import DisplayStatisticChange from './DisplayStatisticChange'

const DisplayStatisticNumber = ({
  endDate,
  format = 'none',
  reverseChangeColors,
  round = 0,
  startDate,
  statisticChange,
  statisticName = 'Name',
  statisticValue = 0
}) => {
  const converted = () => {
    switch (format) {
      case 'elapsedTime':
        const totalSeconds = Math.round(statisticValue / 1000)
        const hours = Math.floor(totalSeconds / 3600)
        const minutes = Math.floor(totalSeconds / 60) % 60
        const seconds = totalSeconds % 60
        return { hours, minutes, seconds }
        break
      case 'percent':
        return statisticValue * 100
        break
      default:
        return statisticValue
    }
  }

  const rounded = () => {
    const expanded = 10 ** round * converted()
    const rounded = Math.round(expanded)
    const compressed = 10 ** (round * -1) * rounded
    const fixed = compressed.toFixed(round)
    const float = parseFloat(fixed)
    return float
  }

  const formatted = () => {
    switch (format) {
      case 'elapsedTime':
        const  { hours, minutes, seconds } = converted()
        return `${hours > 0 ? hours+'h' : ''} ${minutes > 0 ? minutes+'m' : ''} ${seconds}s`
        break
      case 'percent':
        return `${rounded()}%`
        break
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
        <DisplayStatisticChange reverseChangeColors={reverseChangeColors} statisticChangeValue={statisticChange} />
        <div className='display-statistic-number-date-range'>
          {startDate && formattedStartDate()} { startDate && endDate && rangeSeparator } {endDate && formattedEndDate()}
        </div>
      </div>
    </>
  )
}

const { bool, instanceOf, number, string } = PropTypes

DisplayStatisticNumber.propTypes = {
  endDate: instanceOf(Date),
  format: string,
  reverseChangeColors: bool,
  round: number,
  startDate: instanceOf(Date),
  statisticChange: number,
  statisticName: string,
  statisticValue: number
}

export default DisplayStatisticNumber
