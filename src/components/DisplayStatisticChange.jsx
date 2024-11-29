import { PropTypes } from 'prop-types'

const DisplayStatisticChange = ({
  reverseChangeColors = false,
  statisticChangeValue,
}) => {
  const formatted = () => {
    return Math.round(statisticChangeValue * 100) + '%'
  }

  const statisticSign = reverseChangeColors ? statisticChangeValue * -1 : statisticChangeValue
  if (statisticChangeValue || statisticChangeValue === 0) {
  return (
    <div className="display-statistic-change" style={{background: statisticSign < 0 ? "#faa" : "#afa"}}>
      <span style={{color: statisticSign < 0 ? "#c00" : "#0a0"}}>
        {formatted()}
      </span>
    </div>
  )
 } else {
  return null
 }
}

const { bool, number } = PropTypes

DisplayStatisticChange.propTypes = {
  reverseChangeColors: bool,
  statisticChangeValue: number,
}

export default DisplayStatisticChange
