import React, { useEffect } from 'react'
import { fade, makeStyles } from '@material-ui/core/styles'
import { useRouter } from 'next/router'
import Link from '../src/Link'
import cookie from 'js-cookie'
import MenuIcon from '@material-ui/icons/Menu'
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount'
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Grid,
  Box,
  Tooltip
} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  logo: {
    width: 'auto',
    height: 'auto'
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    },
    color: 'black'
  }
}))

export default function SearchAppBar () {
  const classes = useStyles()
  const router = useRouter()
  let roles

  useEffect(() => {
    roles = cookie.get('roles')
  }, [])

  const reset = () => {
    cookie.remove('token')
    router.push('/')
  }

  return (
    <div className={classes.root}>
      <AppBar position='static'>
        <Toolbar>
          <Box width={1}>
            <Grid container direction='row' alignItems='center'>
              <Grid item xs={5}>
                <img
                  src='/images/valley-cutting-systems-logo.png'
                  alt='Valley Cutting Systems'
                  className={classes.logo}
                  style={{ marginTop: 6 }}
                  onClick={reset}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant='h6' noWrap className={classes.title}>
                  <Link href='/reports'>Field Service Reports</Link>
                </Typography>
              </Grid>
              <Grid item xs={1}>
                {roles && roles.includes('admin') ? (
                  <Tooltip title='Manage Users'>
                    <IconButton onClick={() => router.push('/users')}>
                      <SupervisorAccountIcon color='secondary' />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <span />
                )}
              </Grid>
            </Grid>
          </Box>
        </Toolbar>
      </AppBar>
    </div>
  )
}
