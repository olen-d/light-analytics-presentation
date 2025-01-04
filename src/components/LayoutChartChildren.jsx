import { PropTypes } from 'prop-types'

import LegendChart from './LegendChart'
import SourceChart from './SourceChart'
import SubtitleChart from './SubtitleChart'
import TitleChart from './TitleChart'

const LayoutChartChildren = ({
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

const { array, node, number, string } = PropTypes

LayoutChartChildren.propTypes = {
  chartColors: array,
  chartData: array,
  children: node,
  locationLegend: string,
  startAngle: number,
  subtitle: string,
  title: string,
  source: string
}

export default LayoutChartChildren
