import { PropTypes } from 'prop-types'

const DisplayStatisticChange = ({
  statisticChangeValue,
}) => {
  const formatted = () => {
    return Math.round(statisticChangeValue * 100) + '%'
  }

 if (statisticChangeValue || statisticChangeValue === 0) {
  return (
    <div className="display-statistic-change" style={{background: statisticChangeValue < 0 ? "#faa" : "#afa"}}>
      <span style={{color: statisticChangeValue < 0 ? "#c00" : "#0a0"}}>
        {formatted()}
      </span>
    </div>
  )
 } else {
  return null
 }
}

const { number } = PropTypes

DisplayStatisticChange.propTypes = {
  statisticChangeValue: number,
}

export default DisplayStatisticChange
