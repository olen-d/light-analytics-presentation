import './App.css'

import {
  BrowserRouter as Router,
  useRoutes,
  Link,
  Outlet,
  useParams
} from 'react-router-dom'

import HomeView from './views/HomeView'

const NoMatch = () => {
  return(
    <>
      <h1>404</h1>
      <p className='text-large'>
        Call the Vatican. See if something is missing.
      </p>
      <p className='author-quote mt-n1'>
        -- Dr. Ben Sobel
      </p>
    </>
  )
}
const Routes = () => {
  const element = useRoutes([
    { path: '/', element: <HomeView />},
    { path: '*', element: <NoMatch />}
  ])
  return element;
}

const App = () => {
  return (
    <>
      <div className="top-logo">
        <h1 className="site-title text-medium uppercase">Light Analytics</h1>
      </div>
      <Router>
        <Routes />
      </Router>
    </>
  )
}

export default App
