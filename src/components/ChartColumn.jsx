import { PropTypes } from 'prop-types'

const SVG_WIDTH = 300
const SVG_HEIGHT = 200

const ChartColumn = (
  {
    categoryName,
    categoryKey,
    chartData,
    seriesName,
    startFromValue,
    valueKey = 'count'
  }
) => {
  const x0 = 60
  const yPaddingBottom = 60

  const xAxisLength = SVG_WIDTH - x0

  const y0 = 0
  const yAxisLength = SVG_HEIGHT - yPaddingBottom

  const xAxisY = y0 +  yAxisLength

  const dataYMax = chartData.length > 0 ? chartData.reduce((a, b) => a[valueKey] > b[valueKey] ? a : b)[valueKey] : 0
  const dataYMin = chartData.length > 0 ? chartData.reduce((a, b) => a[valueKey] < b[valueKey] ? a : b)[valueKey] : 0

  const dataYMinAdjusted = isNaN(startFromValue) ? dataYMin : startFromValue

  const dataYRange = dataYMax - dataYMinAdjusted

  const columnPlotWidth = xAxisLength / chartData.length

  const columnPadding = 4

  const categoryNameOffset = categoryName?.length * 3.5 || 0
  const seriesNameOffset = seriesName?.length * 3 || 0

  let tickInterval = 0

  if (dataYRange <= 5) {
    tickInterval = 1
  } else if (dataYRange <= 10) {
    tickInterval = 2
  } else if (dataYRange <= 25) {
    tickInterval = 5
  } else if (dataYRange <= 50) {
    tickInterval = 10
  } else if (dataYRange <= 100) {
    tickInterval = 20
  } else if (dataYRange <= 150) {
    tickInterval = 30
  } else if (dataYRange <= 200) {
    tickInterval = 40
  } else if (dataYRange <= 300) {
    tickInterval = 60
  } else if (dataYRange <= 500) {
    tickInterval = 100
  } else if (dataYRange <= 1000) {
    tickInterval = 200
  } else if (dataYRange <= 2500) {
    tickInterval = 500
  } else if (dataYRange <= 5000) {
    tickInterval = 1000
  } else if (dataYRange <= 7500) {
    tickInterval = 1500
  } else if (dataYRange <= 10000) {
    tickInterval = 2000
  } else {
    tickInterval = 10000
  }

  const numYTicks = dataYMax / tickInterval

  if (chartData.length <= 0) {
    return null
  }

  return(
    <div className="chart-graphic">
      <svg width={SVG_WIDTH} height={SVG_HEIGHT}>
        <line
          x1={x0 - 5}
          y1={xAxisY}
          x2={x0 + xAxisLength}
          y2={xAxisY}
          stroke='#555'
        />
        <text className='chart-text-label-ticks' x={x0 - 10} y={xAxisY + 4} textAnchor='end'>
          {dataYMinAdjusted}
        </text>
        <text className='chart-text-label-category-name' x={(x0 + xAxisLength / 2 - categoryNameOffset)} y={xAxisY + 56}>
          {categoryName}
        </text>
        {Array.from({ length: numYTicks }).map((element, index) => {
          const value = (index + 1) * tickInterval
          const yRatio = (value - dataYMinAdjusted ) / dataYRange
          const y = y0 + (1- yRatio) * yAxisLength
          const yValue = (index + 1)  * tickInterval
            return (
              <g key={index}>
                <line
                  x1={x0 + xAxisLength}
                  y1={y}
                  x2={x0 - 5}
                  y2={y}
                  stroke='#555'
                  strokeDasharray='1,1'
                />
                <text className='chart-text-label-ticks' x={x0 - 10} y={y + 5} textAnchor='end'>
                  {yValue}
                </text>
              </g>
            )
          // }
        })}

        <text
          className='chart-text-label-series-name'
          x={20}
          y={SVG_HEIGHT / 2 - seriesNameOffset}

          textAnchor = 'middle'
          transform={`rotate(-90, ${20}, ${SVG_HEIGHT / 2 - seriesNameOffset})`}
        >
          {seriesName}
        </text>

        {chartData.map(({ [categoryKey]: category, [valueKey]: value }, index) => {
          const x = x0 + index * columnPlotWidth
          const yRatio = (value - dataYMinAdjusted ) / dataYRange
          const y = y0 + (1 - yRatio) * yAxisLength
          const height = yRatio * yAxisLength

          return (
            <g key={index}>
              <rect
                x={x + columnPadding / 2}
                y={y}
                width={columnPlotWidth - columnPadding}
                height={height}
                className='chart-series-1'
              />
              <text
                className='chart-text-label-category'
                x={x + columnPlotWidth / 2}
                y={xAxisY + 24}
                textAnchor='middle'
              >
                {category}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

const { array, number, string } = PropTypes

ChartColumn.propTypes = {
  categoryName: string,
  categoryKey: string,
  chartData: array,
  seriesName: string,
  startFromValue: number,
  valueKey: string
}

export default ChartColumn
