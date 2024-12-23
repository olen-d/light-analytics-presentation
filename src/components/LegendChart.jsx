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

  if (chartData?.length > 0) {
    return (
      <div className="container-legend-chart">
        {chartData.map(renderItem)}
      </div>
    )
  } else {
    return null
  }
}

const { array } = PropTypes

LegendChart.propTypes = {
  chartColors: array,
  chartData: array,
}

export default LegendChart
