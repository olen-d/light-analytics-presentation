import { Button, Stack } from '@mui/material'

const HomeView = () => {
  return (
    <>
      <h1 className="site-lead extended">Open source analytics platform for key customer insights.</h1>
      <p className="text-large">
        Easy to use analytics software focused on critical metrics. Learn how customers are engaging with your site without reviewing an overwhelming number of measures. Designed to prioritize efficiency and keep your user experience snappy.
      </p>
      <div>
        <Stack justifyContent="center" direction="row" spacing={2}>
          <Button variant="contained">Get Started</Button>&nbsp;
          <Button variant="outlined">Log In</Button>
        </Stack>
      </div>
    </>
  )
}

export default HomeView
