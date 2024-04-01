'use strict'

import { PropTypes } from 'prop-types'

const TitleChart = ({ title }) => {
  return (
    <div className="chart-text-title">
      {title}
    </div>
  )
}

const { string } = PropTypes

TitleChart.propTypes = {
  title: string,
}


export default TitleChart
