'use strict'

const SVG_WIDTH = 500
const SVG_HEIGHT = 400
const PIE_WIDTH = SVG_WIDTH - SVG_WIDTH * 0.3
const PIE_HEIGHT = SVG_HEIGHT - SVG_HEIGHT * 0.3

const ChartPie = (
  {
    chartColors,
    chartData,
    endAngle = 0,
    startAngle = 0
  }
) => {
  const total = chartData.reduce((sum, { value }) => sum + value, 0)

  const center = SVG_WIDTH / 2
  const radius = Math.min(PIE_WIDTH, PIE_HEIGHT) / 2

  let chartStartAngle = startAngle
  let chartEndAngle = endAngle
  let nextX = 0
  let x = 0
  let y = 0

  const renderSlice = ({ dataLabel, value }, index) => {
    const sliceAngle = value / total * 360
    const isLargeArc = sliceAngle > 180 ? 1 : 0

    chartStartAngle = chartEndAngle
    chartEndAngle = chartStartAngle + sliceAngle

    const textOffset = dataLabel.length * 8
    x = nextX
    if (x > SVG_WIDTH - textOffset) {
      x = 0
      nextX = textOffset + 8
      y += 22
    } else {
      nextX += textOffset
    } 

    const startX = center + radius * Math.cos((chartStartAngle * Math.PI) / 180)
    const startY = center + radius * Math.sin((chartStartAngle * Math.PI) / 180 )
    const endX = center + radius * Math.cos((chartEndAngle * Math.PI) / 180)
    const endY = center + radius * Math.sin((chartEndAngle * Math.PI) / 180)

    const pathData = [
      `M ${center} ${center}`,
      `L ${startX} ${startY}`,
      `A ${radius} ${radius} 0 ${isLargeArc} 1 ${endX} ${endY}`,
      'Z'
    ].join(' ')

    return (
      <g key={index} fill={chartColors[index]} >
        <path d={pathData} />
        <rect
          x={x}
          y={y}
          width={10}
          height={10}
        />
        <text
          className="chart-text-legend"
          x={x + 15}
          y={y + 10}
          textAnchor="start"
        >
          {dataLabel}
        </text>
      </g>
    )
  }

  return (
    <svg width={SVG_WIDTH} height={SVG_HEIGHT}>
      {chartData.map(renderSlice)}
    </svg>
  )
}

export default ChartPie
