import * as React from 'react'

import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'



const TheAppBar = () => {
  const pages = [
    { name: 'Home', route: '/', guarded: false },
    { name: 'Dashboard', route: 'admin', guarded: true },
    { name: 'Visitors', route: '/admin/visitors', guarded: true },
    { name: 'Settings', route: '/admin/settings', guarded: true }
  ]

  const [anchorElNav, setAnchorElNav] = React.useState(null)

  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const pagesToRender = pages.filter(element => {
    const { guarded } = element
    if (!guarded || guarded && isAuthenticated) { return element }
  })

  const handleClick = e => {
    const { target: { value: route } } = e
    handleCloseNavMenu()
    handleNavigation(route)
  }

  const handleNavigation = route => {
    navigate(route)
  }

  const handleOpenNavMenu = e => {
    const { currentTarget } = e
    setAnchorElNav(currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  return(
    <div className="app-bar">
      <AppBar position="absolute">
          <Container maxWidth="x1">
            <Toolbar disableGutters>
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 10,
                  display: { xs: 'none', md: 'flex' },
                  fontWeight: 400,
                  color: 'inherit',
                  textDecoration: 'none',
                  textTransform: 'uppercase'
                }}
              >
                Light Analytics
              </Typography>
              <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none'} }}>
                <IconButton
                  size="large"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id='menu-appbar'
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{ display: { xs: 'block', md: 'none' } }}
                >
                  {pagesToRender.map(({ name, route }) => (
                    <MenuItem key={name} onClick={handleCloseNavMenu}>
                      <Typography textAlign="center"><Link to={route}>{name}</Link></Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
              <Typography
                variant="h5"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 2,
                  display: { xs: 'flex', md: 'none' },
                  flexGrow: 1,
                  fontWeight: 400,
                  color: 'inherit',
                  textDecoration: 'none',
                  textTransform: 'uppercase'
                }}
              >
                Light Analytics
              </Typography>
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                {pagesToRender.map(({ name, route }) => (
                  <Button
                    key={name}
                    value={route}
                    onClick={handleClick}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                    >
                      {name}
                    </Button>
                ))}
              </Box>
            </Toolbar>
          </Container>
      </AppBar>
    </div>
  )
}

export default TheAppBar
