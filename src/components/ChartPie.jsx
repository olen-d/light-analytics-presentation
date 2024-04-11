'use strict'

const SVG_WIDTH = 300
const SVG_HEIGHT = 200
const PIE_WIDTH = SVG_WIDTH
const PIE_HEIGHT = SVG_HEIGHT

const ChartPie = (
  {
    chartColors,
    chartData,
    startAngle = 0
  }
) => {
  const total = chartData.reduce((sum, { value }) => sum + value, 0)

  const centerX = SVG_WIDTH / 2
  const centerY = SVG_HEIGHT / 2
  const radius = Math.min(PIE_WIDTH, PIE_HEIGHT) / 2

  let chartStartAngle = startAngle
  let chartEndAngle = chartStartAngle

  const renderSlice = ({ dataLabel, value }, index) => {
    const sliceAngle = value / total * 360
    const isLargeArc = sliceAngle > 180 ? 1 : 0

    chartStartAngle = chartEndAngle
    chartEndAngle = chartStartAngle + sliceAngle

    const startX = centerX + radius * Math.cos((chartStartAngle * Math.PI) / 180)
    const startY = centerY + radius * Math.sin((chartStartAngle * Math.PI) / 180 )
    const endX = centerX + radius * Math.cos((chartEndAngle * Math.PI) / 180)
    const endY = centerY + radius * Math.sin((chartEndAngle * Math.PI) / 180)

    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${startX} ${startY}`,
      `A ${radius} ${radius} 0 ${isLargeArc} 1 ${endX} ${endY}`,
      'Z'
    ].join(' ')

    return (
        <path key={index} d={pathData} fill={chartColors[index]} />
    )
  }

  return (
    <div className="chart-graphic">
      <svg width={SVG_WIDTH} height={SVG_HEIGHT}>
        {chartData.map(renderSlice)}
      </svg>
    </div>
  )
}

export default ChartPie
