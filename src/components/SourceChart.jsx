'use strict'

import { PropTypes } from 'prop-types'

const SourceChart = ({ source }) => {
  return (
    <div className="chart-text-source">
      <span className="chart-text-source-label">Source:</span> {source}
    </div>
  )
}

const { string } = PropTypes

SourceChart.propTypes = {
  source: string,
}


export default SourceChart
