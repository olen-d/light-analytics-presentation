import './App.css'

import {
  BrowserRouter as Router,
  useRoutes,
  Link,
  Outlet,
  useParams
} from 'react-router-dom'

import HomeView from './views/HomeView'
import LoginView from './views/LoginView'
import SignupView from './views/SignupView'

import TheAppBar from './components/TheAppBar'

const baseSpaUrl = import.meta.env.VITE_BASE_SPA_URL

const NoMatch = () => {
  return(
    <>
      <h1>404</h1>
      <p className='text-large'>
        Call the Vatican. See if something is missing.
      </p>
      <p className='author-quote mt-n1'>
        &mdash; Dr. Ben Sobel
      </p>
    </>
  )
}
const Routes = () => {
  const element = useRoutes([
    { path: '/', element: <HomeView />},
    { path: '/login', element: <LoginView />},
    { path: '/signup', element: <SignupView />},
    { path: '*', element: <NoMatch />}
  ])
  return element
}

const App = () => {
  return (
    <>
      <Router basename={baseSpaUrl}>
        <TheAppBar />
        <Routes />
      </Router>
    </>
  )
}

export default App
