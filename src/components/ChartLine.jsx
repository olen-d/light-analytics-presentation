import { PropTypes } from 'prop-types'

const ChartLine = (
  {
    categoryName,
    categoryKey,
    chartData,
    chartSize = 'xs',
    seriesName,
    startFromValue,
    valueKey = 'count'
  }
) => {
  let SVG_WIDTH = 300
  let SVG_HEIGHT = 170

  switch (chartSize) {
    case 'lg':
      SVG_WIDTH = 1200
      SVG_HEIGHT = 240
      break
    case 'md':
      SVG_WIDTH = 900
      SVG_HEIGHT = 240
      break
    case 'sm':
      SVG_WIDTH = 600
      SVG_HEIGHT = 235
      break
    default:
    case 'xs':
      SVG_WIDTH = 300
      SVG_HEIGHT = 170
      break
  }

  const x0 = 60
  const yPaddingBottom = 60

  const xAxisLength = SVG_WIDTH - x0

  const y0 = 0
  const yAxisLength = SVG_HEIGHT - yPaddingBottom

  const xAxisY = y0 +  yAxisLength

  const dataLength = chartData?.length || 0

  const dataYMax = dataLength > 0 ? chartData.reduce((a, b) => a[valueKey] > b[valueKey] ? a : b)[valueKey] : 0
  const dataYMin = dataLength > 0 ? chartData.reduce((a, b) => a[valueKey] < b[valueKey] ? a : b)[valueKey] : 0

  const dataYMinAdjusted = isNaN(startFromValue) ? dataYMin : startFromValue
  const dataYRange = dataYMax - dataYMinAdjusted

  const xWidth = xAxisLength / dataLength

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

  let shouldSkipCategoryLabel = false
  let skipCategoryLabelInterval = 0

  switch (chartSize) {
    case 'xs':
      shouldSkipCategoryLabel = true
      skipCategoryLabelInterval = dataLength > 24 ? 6 : dataLength > 8 ? 3 : 2
      break
    case 'sm':
      shouldSkipCategoryLabel = dataLength > 8
      skipCategoryLabelInterval = dataLength >= 24 ? 3 : 2
      break
    case 'md':
      shouldSkipCategoryLabel = dataLength >= 24
      skipCategoryLabelInterval = 2
      break
    case 'lg':
      shouldSkipCategoryLabel = false
      skipCategoryLabelInterval = 0
      break
  }

  let path = ''

  const getLinePoints = () => {
    path += chartData.map(({ [categoryKey]: category, [valueKey]: value }, index) => {
      const x = x0 + index * xWidth
      const yRatio = (value - dataYMinAdjusted ) / dataYRange
      const y = y0 + (1 - yRatio) * yAxisLength
      return `${x},${y} `
    })
    return path.trim()
  }

  if (dataLength <= 0) {
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

            <g key={1}>
              <polyline 
                points={`${getLinePoints()}`}
                className='chart-line-series-1'
              />
              {chartData.map(({ [categoryKey]: category, [valueKey]: value }, index) => {
                const x = x0 + index * xWidth
                const shouldPrintCategoryLabel = !shouldSkipCategoryLabel || index % skipCategoryLabelInterval === 0
                return(
                  <g key={index}>
                    <circle 
                      r="5"
                      cx={x}
                      cy={y0 + (1 - (value - dataYMinAdjusted ) / dataYRange) * yAxisLength}
                      className="chart-line-point-series-1"
                    />
                    {
                      shouldPrintCategoryLabel &&
                      <text
                        className='chart-text-label-category'
                        x={x}
                        y={xAxisY + 24}
                        textAnchor='middle'
                      >
                        {category}
                      </text>
                    }
                  </g>
                  )
                })
              }
            </g>
      </svg>
    </div>
  )
}

const { array, number, string } = PropTypes

ChartLine.propTypes = {
  categoryName: string,
  categoryKey: string,
  chartData: array,
  chartSize: string,
  seriesName: string,
  startFromValue: number,
  valueKey: string
}

export default ChartLine
