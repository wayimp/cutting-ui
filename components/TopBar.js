import React, { useEffect } from 'react'
import { fade, makeStyles } from '@material-ui/core/styles'
import { useRouter } from 'next/router'
import Link from '../src/Link'
import cookie from 'js-cookie'
import MenuIcon from '@material-ui/icons/Menu'
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Tooltip from '@material-ui/core/Tooltip'

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
    color: '#000000'
  }
}))

export default function SearchAppBar (props) {
  const classes = useStyles()
  const router = useRouter()
  const [roles, setRoles] = React.useState('')

  useEffect(() => {
    const rolesCookie = cookie.get('roles')
    setRoles(rolesCookie)
  }, [])

  const reset = () => {
    cookie.remove('token')
    router.push('/')
  }

  return (
    <div className={classes.root}>
      <AppBar
        position='static'
        color={
          typeof props.fieldService === 'undefined'
            ? 'primary'
            : props.fieldService
            ? 'primary'
            : 'secondary'
        }
      >
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
                <Typography component='h6' noWrap>
                  <Link href='/reports' className={classes.title}>
                    {typeof props.fieldService === 'undefined'
                      ? 'Service Reports'
                      : props.fieldService
                      ? 'Field Service Report'
                      : 'Technical Service Report'}
                  </Link>
                </Typography>
              </Grid>
              <Grid item xs={1}>
                {roles && roles.includes('admin') ? (
                  <Tooltip title='Manage Users'>
                    <IconButton onClick={() => router.push('/users')}>
                      <SupervisorAccountIcon
                        color={
                          typeof props.fieldService === 'undefined'
                            ? 'secondary'
                            : props.fieldService
                            ? 'secondary'
                            : 'primary'
                        }
                      />
                    </IconButton>
                  </Tooltip>
                ) : (
                  JSON.stringify(roles)
                )}
              </Grid>
            </Grid>
          </Box>
        </Toolbar>
      </AppBar>
    </div>
  )
}
