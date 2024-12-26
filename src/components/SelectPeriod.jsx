import { useState } from 'react'

import SelectGeneric from "./form-fields/SelectGeneric"

const SelectPeriod = ({
  id = 'select-period',
  initialPeriod = 'forever',
  labeltext = 'Period',
  onQueryString
}) => {
  const [period, setPeriod] = useState(initialPeriod)

  const options = [
    {
      label: 'Last 24 Hours',
      value: 'last24h',
      description: ''
    },
    {
      label: 'Last 7 Days',
      value: 'last7d',
      description: ''
    },
    {
      label: 'Last 30 Days',
      value: 'last30d',
      description: ''
    },
    {
      label: 'Last 6 Months',
      value: 'last6m',
      description: ''
    },
    {
      label: 'Last 12 Months',
      value: 'last12m',
      description: ''
    },
    {
      label: 'All Time',
      value: 'forever',
      description: ''
    }
  ]

  const formatDateQueryString = date => {
    const dayJs = date.getDate()
    const monthJs = date.getMonth() + 1
    const day = dayJs.toString().padStart(2, '0')
    const month = monthJs.toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${year}-${month}-${day}`
  }

  const formatDateTimeQueryString = dateTime => {
    const dateString = formatDateQueryString(dateTime)

    const hoursJs = dateTime.getHours()
    const hours = hoursJs.toString().padStart(2, '0')
    const minutesJs = dateTime.getMinutes()
    const minutes = minutesJs.toString().padStart(2, '0')
    const secondsJs = dateTime.getSeconds()

    return `${dateString}T${hours}:${minutes}:${secondsJs}`
  }

  const handleChange = event => {
    const { target: { value: selectValue }, } = event

    setPeriod(selectValue)

    const endDateJs = new Date()
    const startDateJs = new Date()
    
    const endDate = formatDateQueryString(endDateJs)
    const endDateTime = formatDateTimeQueryString(endDateJs)

    let startDate = null
    let startDateTime = null
    let queryString = ''

    switch (selectValue) {
      case 'last24h':
        startDateJs.setHours(startDateJs.getHours() - 24)
        startDateTime = formatDateTimeQueryString(startDateJs)
        queryString = `?startdate=${startDateTime}&enddate=${endDateTime}`
        break
      case 'last7d':
        startDateJs.setDate(startDateJs.getDate() - 6)
        startDate = formatDateQueryString(startDateJs)
        queryString = `?startdate=${startDate}&enddate=${endDate}`
        break
      case 'last30d':
        startDateJs.setDate(startDateJs.getDate() - 29)
        startDate = formatDateQueryString(startDateJs)
        queryString = `?startdate=${startDate}&enddate=${endDate}`
        break
      case 'last6m':
        startDateJs.setMonth(startDateJs.getMonth() - 6)
        startDate = formatDateQueryString(startDateJs)
        queryString = `?startdate=${startDate}&enddate=${endDate}`
        break
      case 'last12m':
        startDateJs.setMonth(startDateJs.getMonth() - 12)
        startDate = formatDateQueryString(startDateJs)
        queryString = `?startdate=${startDate}&enddate=${endDate}`
        break
      case 'forever':
      default:
        queryString = ''
    }
    onQueryString(queryString)
  }

  return (
    <div className="select-period">
      <SelectGeneric
        handleChange={handleChange}
        id={id}
        initialValue={period}
        labelId={`${id}-label`}
        labeltext={labeltext}
        options={options}
      />
    </div>
  )
}

export default SelectPeriod
