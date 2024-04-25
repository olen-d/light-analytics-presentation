'use strict'

import { PropTypes } from 'prop-types'

const SVG_WIDTH = 300
const SVG_HEIGHT = 200

const ChartBar = (
  {
    categoryName,
    categoryKey,
    chartData,
    seriesName,
    startFromValue
  }
) => {
  const x0 = 100
  const yPaddingBottom = 60

  const xAxisLength = SVG_WIDTH - x0

  const y0 = 0
  const yAxisLength = SVG_HEIGHT - yPaddingBottom

  const xAxisY = y0 +  yAxisLength

  const dataXMax = chartData.length > 0 ? chartData.reduce((a, b) => a.value > b.value ? a : b).value : 0
  const dataXMin = chartData.length > 0 ? chartData.reduce((a, b) => a.value < b.value ? a : b).value : 0

  const dataXMinAdjusted = isNaN(startFromValue) ? dataXMin : startFromValue

  const dataXRange = dataXMax - dataXMinAdjusted

  const barPlotHeight = yAxisLength / chartData.length

  const barPadding = 4

  const categoryNameOffset = categoryName ? categoryName.length * 3.5 : 0
  const seriesNameOffset = seriesName ? seriesName.length * 3 : 0

  let tickInterval = 0

  if (dataXRange <= 5) {
    tickInterval = 1
  } else if (dataXRange <= 10) {
    tickInterval = 2
  } else if (dataXRange <= 25) {
    tickInterval = 5
  } else if (dataXRange <= 50) {
    tickInterval = 10
  } else if (dataXRange <= 100) {
    tickInterval = 20
  } else if (dataXRange <= 150) {
    tickInterval = 30
  } else if (dataXRange <= 200) {
    tickInterval = 40
  } else if (dataXRange <= 300) {
    tickInterval = 60
  } else if (dataXRange <= 500) {
    tickInterval = 100
  } else if (dataXRange <= 1000) {
    tickInterval = 200
  } else if (dataXRange <= 2500) {
    tickInterval = 500
  } else if (dataXRange <= 5000) {
    tickInterval = 1000
  } else if (dataXRange <= 7500) {
    tickInterval = 1500
  } else if (dataXRange <= 10000) {
    tickInterval = 2000
  } else {
    tickInterval = 10000
  }

  const numXTicks = dataXMax / tickInterval

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
        <text className='chart-text-label-ticks' x={x0} y={xAxisY + 20} textAnchor='end'>
          {dataXMinAdjusted}
        </text>
        <text className='chart-text-label-category-name' x={(x0 + xAxisLength / 2 - categoryNameOffset)} y={xAxisY + 56}>
          {seriesName}
        </text>
        {Array.from({ length: numXTicks }).map((element, index) => {
          const value = (index + 1) * tickInterval
          const xRatio = (value - dataXMinAdjusted ) / dataXRange
          const x = x0 + xRatio * xAxisLength
          const xValue = (index + 1)  * tickInterval
          const y = xAxisY
            return (
              <g key={index}>
                <line
                  x1={x}
                  y1={y - yAxisLength}
                  x2={x}
                  y2={y}
                  stroke='#555'
                  strokeDasharray='1,1'
                />
                <text className='chart-text-label-ticks' x={x} y={y + 20} textAnchor='middle'>
                  {xValue}
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
          {categoryName}
        </text>

        {chartData.map(({ [categoryKey]: category, value }, index) => {
          const y = y0 + index * barPlotHeight
          const xRatio = (value - dataXMinAdjusted ) / dataXRange
          // const x = x0 + (1 - xRatio) * xAxisLength
          const x = x0 - 5
          const width = xRatio * xAxisLength

          return (
            <g key={index}>
              <rect
                x={x}
                y={y + barPadding / 2}
                width={width}
                height={barPlotHeight - barPadding}
                className='chart-series-1'
              />
              <text
                className='chart-bar-text-label-caetegory-name'
                // x={x + columnPlotWidth / 2}
                // y={xAxisY + 24}
                x={x0 - 10}
                y={y + barPlotHeight / 2 + barPadding}
                textAnchor='end'
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

ChartBar.propTypes = {
  categoryName: string,
  categoryKey: string,
  chartData: array,
  seriesName: string,
  startFromValue: number
}

export default ChartBar
