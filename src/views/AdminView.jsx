'use strict'

import { useEffect, useState } from 'react'

import ChartColumn from '../components/ChartColumn'
import DisplayStatisticNumber from '../components/DisplayStatisticNumber'

import { Unstable_Grid2 as Grid } from '@mui/material'

const AdminView = () => {
  const apiKeyRead = import.meta.env.VITE_ANALYTICS_API_KEY_READ
  const baseAnalyticsApiUrl = import.meta.env.VITE_ANALYTICS_API_BASE_URL

  const [bounceRate, setBounceRate] = useState(0)
  const [totalSinglePageSessions, setTotalSinglePageSessions] = useState(0)
  const [totalVisits, setTotalVisits] = useState(0)
  const [totalVisitsByDay, setTotalVisitsByDay] = useState([])
  const [totalVisitsByDayFormatted, setTotalVisitsByDayFormatted] = useState([])
  const [uniqueVisits, setUniqueVisits] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      const requestOptions = {
        method: 'GET',
        headers: {
          'api-key': apiKeyRead
        }
      }
  
      try {
        const endDateJs = new Date()
        const startDateJs = new Date()
        startDateJs.setDate(startDateJs.getDate() - 6)
        
        const formatDateJs = date => {
          const dayJs = date.getDate()
          const monthJs = date.getMonth() + 1
          const day = dayJs.toString().padStart(2, '0')
          const month = monthJs.toString().padStart(2, '0')
          const year = date.getFullYear()
          return `${year}-${month}-${day}`
        }

        const endDate = formatDateJs(endDateJs)
        const startDate = formatDateJs(startDateJs)

        const response = await fetch(`${baseAnalyticsApiUrl}/api/v1/sessions/by-day?startdate=${startDate}&enddate=${endDate}`, requestOptions)
        const result = await response.json()
        
        if(result.status === 'ok') {
          const { data: { totalVisitsByDay: tvbd }, } = result
          setTotalVisitsByDay(tvbd)

          const datesInPeriod = []

          for(let i=0; i < 7; i++) {
            const lastJs = new Date(startDateJs)
            lastJs.setDate(lastJs.getDate() + i)
            const last = formatDateJs(lastJs)
            datesInPeriod.push(last)
          }

          const totalVisitsWithZeros = datesInPeriod.map(item => {
            const index = tvbd.findIndex(d => d.day === item)
            return index === -1 ? { day: item, count: 0} : tvbd[index]
          })

          const formattedDates = totalVisitsWithZeros.map(item => {
            const { day, count } = item
            const dayParts = day.split('-')
            const jsDate = new Date(dayParts[0], dayParts[1] -1, dayParts[2])

            const options = { weekday: 'short' }
            const dateTimeFormat = new Intl.DateTimeFormat('en-US', options)
            const dateFormatted = dateTimeFormat.format(jsDate)
            return { day: dateFormatted, count }
          })
          setTotalVisitsByDayFormatted(formattedDates)
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async ()=> {
      try {
        const requestOptions = {
          method: 'GET',
          headers: {
            'api-key': apiKeyRead
          }
        }
          const response = await fetch(`${baseAnalyticsApiUrl}/api/v1/sessions/bounce-rate`, requestOptions)
          const result = await response.json()

          if (result.status === 'ok') {
            const { data: { bounceRate: br }, } = result
            setBounceRate(br)
          }
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async ()=> {
      try {
        const requestOptions = {
          method: 'GET',
          headers: {
            'api-key': apiKeyRead
          }
        }
          const response = await fetch(`${baseAnalyticsApiUrl}/api/v1/sessions/unique`, requestOptions)
          const result = await response.json()

          if (result.status === 'ok') {
            const { data: { uniqueVisits: uv }, } = result
            setUniqueVisits(uv)
          }
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async ()=> {
      try {
        const requestOptions = {
          method: 'GET',
          headers: {
            'api-key': apiKeyRead
          }
        }
          const response = await fetch(`${baseAnalyticsApiUrl}/api/v1/sessions`, requestOptions)
          const result = await response.json()

          if (result.status === 'ok') {
            const { data: { totalVisits: tv }, } = result
            setTotalVisits(tv)
          }
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async ()=> {
      try {
        const requestOptions = {
          method: 'GET',
          headers: {
            'api-key': apiKeyRead
          }
        }
          const response = await fetch(`${baseAnalyticsApiUrl}/api/v1/sessions/single-page`, requestOptions)
          const result = await response.json()

          if (result.status === 'ok') {
            const { data: { totalSinglePageSessions: tsps }, } = result
            setTotalSinglePageSessions(tsps)
          }
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  return(
    <>
      <h1 className="site-lead extended">Administration</h1>
      <div>
        <ChartColumn
          categoryName='Dates'
          categoryKey='day'
          chartData={totalVisitsByDayFormatted}
          seriesName='Visits'
          startFromValue={0}
        />
      </div>
      <Grid container spacing={2}>
        <Grid xs={6} md={4} xl={3}>
          <div>
            <DisplayStatisticNumber
              statisticName='Total Visits'
              statisticValue={totalVisits}
            />
          </div>
        </Grid>
        <Grid xs={6} md={4} xl={3}>
          <div>
            <DisplayStatisticNumber
              statisticName='Unique Visits'
              statisticValue={uniqueVisits}
            />
          </div>
        </Grid>
        <Grid xs={6} md={4} xl={3}>
          <div>
            <DisplayStatisticNumber
              statisticName='Single Page Sessions'
              statisticValue={totalSinglePageSessions}
            />
          </div>
        </Grid>
        <Grid xs={6} md={4} xl={3}>
          <div>
            <DisplayStatisticNumber
              format='percent'
              statisticName='Bounce Rate'
              statisticValue={bounceRate}
            />
          </div>
        </Grid>
      </Grid>
    </>
  )
}

export default AdminView
