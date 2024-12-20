import { PropTypes } from 'prop-types'

import LegendChart from './LegendChart'
import SourceChart from './SourceChart'
import SubtitleChart from './SubtitleChart'
import TitleChart from './TitleChart'

const LayoutChart = ({
  chartColors,
  chartData,
  children,
  locationLegend,
  startAngle = 0,
  subtitle,
  title,
  source
}) => {
  return (
    <div className="layout-chart-container">
      <TitleChart title={title} />
      <SubtitleChart subtitle={subtitle} />
      {children}
      <LegendChart chartColors={chartColors} chartData={chartData} />
      {source && <SourceChart source={source} />}
    </div>
  )
}

const { array, number, string } = PropTypes

LayoutChart.propTypes = {
  chartColors: array,
  chartData: array,
  locationLegend: string,
  startAngle: number,
  subtitle: string,
  title: string,
  source: string
}

export default LayoutChart
