import { useState } from 'react'

import LayoutPartOfWhole from '../components/LayoutPartOfWhole'
import LayoutRankedCategories from '../components/LayoutRankedCategories'
import LayoutTimeSeries from '../components/LayoutTimeSeries'
import WidgetStatistics from '../components/WidgetStatistics'

import { Unstable_Grid2 as Grid } from '@mui/material'

const AdminView = () => {
  const apiKeyRead = import.meta.env.VITE_ANALYTICS_API_KEY_READ
  const baseAnalyticsApiUrl = import.meta.env.VITE_ANALYTICS_API_BASE_URL

  const formatDateJs = date => {
    const dayJs = date.getDate()
    const monthJs = date.getMonth() + 1
    const day = dayJs.toString().padStart(2, '0')
    const month = monthJs.toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${year}-${month}-${day}`
  }

  // Set up dates for the statistics Widgets
  const widgetStatsEndDateJs = new Date()
  const widgetStatsStartDateJs = new Date()
  widgetStatsStartDateJs.setDate(widgetStatsStartDateJs.getDate() - 6)
  const widgetStatsEndDateInitial = formatDateJs(widgetStatsEndDateJs)
  const widgetStatsStartDateInitial = formatDateJs(widgetStatsStartDateJs)

  const [widgetStatsEndDate, setWidgetStatsEndDate] = useState(widgetStatsEndDateInitial)
  const [widgetStatsStartDate, setWidgetStatsStartDate] = useState(widgetStatsStartDateInitial)


  return(
    <>
      <Grid container rowSpacing={2} columnSpacing={{ sm:0, md: 10 }} sx={{ mb: '2rem', pt: '7rem'}}>
        <Grid xs={12} sm={6} md={9}>
          <div className="selected-site-title">
            nocargravel.cc
          </div>
        </Grid>
      </Grid>
      <Grid container rowSpacing={2} columnSpacing={{ sm: 0, md: 10}}>
        <Grid xs={12} md={6} lg={4} xl={3}>
          <LayoutTimeSeries
            apiKeyRead={apiKeyRead}
            baseAnalyticsApiUrl={baseAnalyticsApiUrl}
            categoryKey='day'
            categoryName='Days'
            dateLabelFormatOptions={{ weekday: 'short' }}
            dateRangeFormatOptions={{ month: 'long', day: 'numeric' }}
            endpoint="api/v1/sessions/by-day"
            queryString={`?startdate=${widgetStatsStartDate}&enddate=${widgetStatsEndDate}`}
            seriesName="Visits"
            source="No Car Gravel"
            statisticKey="totalVisitsByDay"
            statisticTimeKey="day"
            statisticValueKey="count"
            title="Visits by Weekday"
          />
        </Grid>
        <Grid xs={12} md={6} lg={4} xl={3}>
        <LayoutTimeSeries
            apiKeyRead={apiKeyRead}
            baseAnalyticsApiUrl={baseAnalyticsApiUrl}
            categoryKey='day'
            categoryName='Days'
            dateLabelFormatOptions={{ weekday: 'short' }}
            dateRangeFormatOptions={{ month: 'long', day: 'numeric' }}
            endpoint="api/v1/pages/by-day"
            queryString={`?startdate=${widgetStatsStartDate}&enddate=${widgetStatsEndDate}`}
            source="No Car Gravel"
            seriesName="Views"
            statisticKey="totalViewsByDay"
            statisticTimeKey="day"
            statisticValueKey="count"
            title="Page Views by Weekday"
          />
        </Grid>
        <Grid xs={12} md={6} lg={4} xl={3}>
        <LayoutTimeSeries
            apiKeyRead={apiKeyRead}
            baseAnalyticsApiUrl={baseAnalyticsApiUrl}
            categoryKey='day'
            categoryName='Days'
            dateLabelFormatOptions={{ weekday: 'short' }}
            dateRangeFormatOptions={{ month: 'long', day: 'numeric' }}
            endpoint="api/v1/pages/by-day"
            queryString={`?startdate=${widgetStatsStartDate}&enddate=${widgetStatsEndDate}`}
            seriesName="Minutes"
            source="No Car Gravel"
            statisticKey="totalViewsByDay"
            statisticTimeKey="day"
            statisticValueKey="total_time"
            title="Viewing Time by Weekday"
            valueFormatOptions="microsecondsToMinutes"
          />
        </Grid>
      </Grid>
      <Grid container rowSpacing={2} columnSpacing={{ sm: 0, md: 10}}>
        <Grid xs={12} md={6} lg={4} xl={3}>
          <LayoutPartOfWhole
            apiKeyRead={apiKeyRead}
            baseAnalyticsApiUrl={baseAnalyticsApiUrl}
            dateLabelFormatOptions={{ weekday: 'short' }}
            dateRangeFormatOptions={{ month: 'long', day: 'numeric' }}
            endpoint="api/v1/pages/routes/total-views"
            queryString={`?startdate=${widgetStatsStartDate}&enddate=${widgetStatsEndDate}&levels=2`}
            source="No Car Gravel"
            statisticKey="data"
            statisticCategoryKey="route_consolidated"
            statisticValueKey="total_views"
            title="Routes by Page Views"
          />
        </Grid>
        <Grid xs={12} md={6} lg={4} xl={3}>
          <LayoutPartOfWhole
            apiKeyRead={apiKeyRead}
            baseAnalyticsApiUrl={baseAnalyticsApiUrl}
            dateRangeFormatOptions={{ month: 'long', day: 'numeric' }}
            endpoint="api/v1/pages/routes/components/total-views"
            queryString={`?componentName=courses&startdate=${widgetStatsStartDate}&enddate=${widgetStatsEndDate}`}
            shouldFormatSlug={true}
            source="No Car Gravel"
            statisticKey="data"
            statisticCategoryKey="component_summary"
            statisticValueKey="total_views"
            title="Courses by Page Views"
          />
        </Grid>
        <Grid xs={12} md={6} lg={4} xl={3}>
          <LayoutPartOfWhole
            apiKeyRead={apiKeyRead}
            baseAnalyticsApiUrl={baseAnalyticsApiUrl}
            dateRangeFormatOptions={{ month: 'long', day: 'numeric' }}
            endpoint="api/v1/pages/routes/components/total-time"
            queryString={`?componentName=courses&startdate=${widgetStatsStartDate}&enddate=${widgetStatsEndDate}`}
            shouldFormatSlug={true}
            source="No Car Gravel"
            statisticKey="data"
            statisticCategoryKey="component_summary"
            statisticValueKey="total_time"
            title="Courses by Viewing Time"
          />
        </Grid>
      </Grid>
      <Grid container rowSpacing={2} columnSpacing={{ sm: 0, md: 10}}>
        <Grid xs={12} md={6} lg={4} xl={3}>
          <LayoutRankedCategories
            apiKeyRead={apiKeyRead}
            baseAnalyticsApiUrl={baseAnalyticsApiUrl}
            dateRangeFormatOptions={{ month: 'long', day: 'numeric' }}
            endpoint="api/v1/pages/entry"
            queryString={`?startdate=${widgetStatsStartDate}&enddate=${widgetStatsEndDate}`}
            source="No Car Gravel"
            statisticKey="data"
            statisticCategoryKey="entry_page"
            statisticValueKey="entry_page_count"
            title="Entry Pages by Views"
          />
        </Grid>
        <Grid xs={12} md={6} lg={4} xl={3}>
          <LayoutRankedCategories
            apiKeyRead={apiKeyRead}
            baseAnalyticsApiUrl={baseAnalyticsApiUrl}
            dateRangeFormatOptions={{ month: 'long', day: 'numeric' }}
            endpoint="api/v1/pages/exit"
            queryString={`?startdate=${widgetStatsStartDate}&enddate=${widgetStatsEndDate}`}
            source="No Car Gravel"
            statisticKey="data"
            statisticCategoryKey="exit_page"
            statisticValueKey="exit_page_count"
            title="Exit Pages by Views"
          />
        </Grid>
      </Grid>
      <Grid container rowSpacing={2} columnSpacing={{ sm:0, md: 10 }}>
        <Grid xs={6} md={4} lg={3} xl={2}>
          <WidgetStatistics
            apiKeyRead={apiKeyRead}
            baseAnalyticsApiUrl={baseAnalyticsApiUrl}
            endpoint={`api/v1/sessions?startdate=${widgetStatsStartDate}&enddate=${widgetStatsEndDate}`}
            statisticChangeKey="totalVisitsChange"
            statisticKey="totalVisits"
            statisticName="Total Visits"
          />
        </Grid>
        <Grid xs={6} md={4} lg={3} xl={2}>
          <WidgetStatistics
            apiKeyRead={apiKeyRead}
            baseAnalyticsApiUrl={baseAnalyticsApiUrl}
            endpoint={`api/v1/sessions/unique?startdate=${widgetStatsStartDate}&enddate=${widgetStatsEndDate}`}
            statisticChangeKey="uniqueVisitsChange"
            statisticKey="uniqueVisits"
            statisticName="Unique Visits"
          />
        </Grid>
        <Grid xs={6} md={4} lg={3} xl={2}>
          <WidgetStatistics
            apiKeyRead={apiKeyRead}
            baseAnalyticsApiUrl={baseAnalyticsApiUrl}
            endpoint={`api/v1/pages/time-on-pages/average?startdate=${widgetStatsStartDate}&enddate=${widgetStatsEndDate}`}
            statisticChangeKey={"timeOnPageAverageChange"}
            statisticFormat="elapsedTime"
            statisticKey="timeOnPageAverage"
            statisticName="Visit Duration"
          />
        </Grid>
        <Grid xs={6} md={4} lg={3} xl={2}>
          <WidgetStatistics
            apiKeyRead={apiKeyRead}
            baseAnalyticsApiUrl={baseAnalyticsApiUrl}
            endpoint={`api/v1/sessions/bounce-rate?startdate=${widgetStatsStartDate}&enddate=${widgetStatsEndDate}`}
            reverseChangeColors={true}
            statisticChangeKey={"bounceRateChange"}
            statisticFormat="percent"
            statisticKey="bounceRate"
            statisticName="Bounce Rate"
          />
        </Grid>
        <Grid xs={6} md={4} lg={3} xl={2}>
          <WidgetStatistics
            apiKeyRead={apiKeyRead}
            baseAnalyticsApiUrl={baseAnalyticsApiUrl}
            endpoint={`api/v1/pages?startdate=${widgetStatsStartDate}&enddate=${widgetStatsEndDate}`}
            statisticChangeKey="totalViewsChange"
            statisticKey="totalViews"
            statisticName="Total Views"
          />
        </Grid>
        <Grid xs={6} md={4} lg={3} xl={2}>
          <WidgetStatistics
            apiKeyRead={apiKeyRead}
            baseAnalyticsApiUrl={baseAnalyticsApiUrl}
            endpoint={`api/v1/pages/views/per-visit?startdate=${widgetStatsStartDate}&enddate=${widgetStatsEndDate}`}
            round={1}
            statisticChangeKey="viewsPerVisitChange"
            statisticKey="viewsPerVisit"
            statisticName="Views Per Visit"
          />
        </Grid>
        <Grid xs={6} md={4} lg={3} xl={2}>
          <WidgetStatistics
            apiKeyRead={apiKeyRead}
            baseAnalyticsApiUrl={baseAnalyticsApiUrl}
            endpoint={`api/v1/pages/time/per-view?startdate=${widgetStatsStartDate}&enddate=${widgetStatsEndDate}`}
            statisticChangeKey="timePerPageviewChange"
            statisticFormat="elapsedTime"
            statisticKey="timePerPageview"
            statisticName="Time Per Pageview"
          />
        </Grid>
      </Grid>
    </>
  )
}

export default AdminView
