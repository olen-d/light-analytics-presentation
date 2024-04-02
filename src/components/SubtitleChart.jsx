'use strict'

import { PropTypes } from 'prop-types'

const SubtitleChart = ({ subtitle }) => {
  return (
    <div className="chart-text-subtitle">
      {subtitle}
    </div>
  )
}

const { string } = PropTypes

SubtitleChart.propTypes = {
  subtitle: string,
}


export default SubtitleChart
