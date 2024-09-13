import './App.css'

import {
  BrowserRouter as Router,
  useRoutes,
  Link,
  Outlet,
  useParams
} from 'react-router-dom'

import AdminView from './views/AdminView'
import HomeView from './views/HomeView'
import LoginView from './views/LoginView'
import SettingsView from './views/SettingsView'
import SignupView from './views/SignupView'
import VisitorsView from './views/VisitorsView'

import ProtectedRoute from './components/ProtectedRoute'

import TheAppBar from './components/TheAppBar'

import { AuthProvider } from './hooks/useAuth'

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
    { path: '/admin',
      element:
        <ProtectedRoute />,
        children: [
          {
            path: "",
            element: <AdminView />
          },
          { path: "settings",
            element: <SettingsView />
          },
          { path: "visitors",
            element: <VisitorsView />
          }
        ]
    },
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
        <AuthProvider>
          <TheAppBar />
          <Routes />
        </AuthProvider>
      </Router>
    </>
  )
}

export default App
