'use strict'

import { PropTypes } from 'prop-types'

const DisplayStatisticNumber = ({
  format = 'none',
  round = 0,
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

  return(
    <>
      <div className='display-statistic-number'>
        <div className='display-statistic-number-value'>
          {formatted()}
        </div>
        <div className='display-statistic-number-name'>
          {statisticName}
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
