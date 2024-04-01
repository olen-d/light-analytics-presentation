'use strict'

import { PropTypes } from 'prop-types'

import LegendChart from './LegendChart'
import TitleChart from './TitleChart'

const LayoutChart = ({
  chart: Chart,
  chartColors,
  chartData,
  locationLegend,
  startAngle = 0,
  subTitle,
  title,
  source
}) => {
 return (
  <>
    <TitleChart title={title} />
    <LegendChart chartColors={chartColors} chartData={chartData} />
    <Chart chartColors={chartColors} chartData={chartData} startAngle={startAngle} />
  </>
 )
}

const { array, number, string } = PropTypes

LayoutChart.propTypes = {
  chartColors: array,
  chartData: array,
  locationLegend: string,
  startAngle: number,
  subTitle: string,
  title: string,
  source: string
}

export default LayoutChart
