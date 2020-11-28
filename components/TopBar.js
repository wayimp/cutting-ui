import React from 'react'
import { fade, makeStyles } from '@material-ui/core/styles'
import { useRouter } from 'next/router'
import Link from '../src/Link'
import cookie from 'js-cookie'
import MenuIcon from '@material-ui/icons/Menu'
import SearchIcon from '@material-ui/icons/Search'
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount'
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
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
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto'
    }
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputRoot: {
    color: 'inherit'
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch'
      }
    }
  }
}))

export default function SearchAppBar () {
  const classes = useStyles()
  const roles = cookie.get('roles')
  const router = useRouter()

  return (
    <div className={classes.root}>
      <AppBar position='static'>
        <Toolbar>
          <Box width={1}>
            <Grid container direction='row' alignItems='center'>
              <Grid item xs={5}>
                <Link
                  href='/'
                  className={classes.logo}
                  onClick={cookie.remove('token')}
                >
                  <img
                    src='/images/valley-cutting-systems-logo.png'
                    alt='Valley Cutting Systems'
                    style={{ marginTop: 6 }}
                  />
                </Link>
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
                  ''
                )}
              </Grid>
            </Grid>
            {/*
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder='Search…'
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
          */}
          </Box>
        </Toolbar>
      </AppBar>
    </div>
  )
}
