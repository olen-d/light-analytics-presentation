'use strict'

import { PropTypes } from 'prop-types'

const LegendChart = ({
  chartColors,
  chartData
}) => {
  const renderItem = ({ dataLabel, value }, index) => {
    const patchColor = { background: chartColors[index] }
    return(
      <div key={index}>
        <div className="container-legend-items">
          <div className="chart-legend-patch" style={patchColor}>
            &nbsp;
          </div>
          <div className="chart-text-legend">
            {dataLabel} ({value})
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-legend-chart">
      {chartData.map(renderItem)}
    </div>
  )
}

const { array } = PropTypes

LegendChart.propTypes = {
  chartColors: array,
  dataLabels: array,
  dataValues: array,
}

export default LegendChart
