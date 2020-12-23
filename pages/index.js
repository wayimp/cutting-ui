import React, { useState } from 'react'
import Router from 'next/router'
import { connect } from 'react-redux'
import { wrapper } from '../components/store'
import { fade, makeStyles, useTheme } from '@material-ui/core/styles'
import Link from '../src/Link'
import TopBar from '../components/TopBar'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import { useSnackbar } from 'notistack'
import cookie from 'js-cookie'
import { axiosClient } from '../src/axiosClient'
import Avatar from '@material-ui/core/Avatar'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
import FormHelperText from '@material-ui/core/FormHelperText'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Snackbar from '@material-ui/core/Snackbar'

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(16),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}))

const Login = ({ dispatch, lang, segment }) => {
  const classes = useStyles()
  const theme = useTheme()
  const [authenticating, setAuthenticating] = React.useState(false)
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const { enqueueSnackbar } = useSnackbar()
  const token = cookie.get('token')

  const handleSubmit = async () => {
    setAuthenticating(true)
    const body = { username, password }
    await axiosClient
      .post('/token', body)
      .then(response => {
        setAuthenticating(false)
        let accessToken,
          roles = ''
        if (response && response.data) {
          accessToken = response.data.access_token
          roles = response.data.roles
        }
        if (accessToken && accessToken.length > 0) {
          enqueueSnackbar('User Logon Success', {
            variant: 'success'
          })
          cookie.set('token', accessToken)
          cookie.set('username', username)
          cookie.set('roles', roles)
          dispatch({ type: 'TOKEN', payload: accessToken })
          Router.push('/reports')
        } else {
          enqueueSnackbar('User Logon Failure', {
            variant: 'error'
          })
          Router.push('/')
        }
      })
      .catch(function (error) {
        enqueueSnackbar('User Logon Failure: ' + error, {
          variant: 'error'
        })
        Router.push('/')
      })
  }

  return (
    <Container>
      <TopBar />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Container maxWidth='xs'>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component='h1' variant='h5'>
              User Sign In
            </Typography>
            <FormControl>
              <TextField
                variant='outlined'
                margin='normal'
                required
                fullWidth
                id='user'
                name='user'
                autoFocus
                label='Username'
                onChange={event => setUsername(event.target.value)}
                inputProps={{
                  autoCapitalize: 'none'
                }}
              />
              <TextField
                variant='outlined'
                margin='normal'
                required
                fullWidth
                name='password'
                type='password'
                id='password'
                label='Password'
                onChange={event => setPassword(event.target.value)}
                inputProps={{
                  autoCapitalize: 'none'
                }}
              />
              <Button
                type='submit'
                fullWidth
                variant='contained'
                color='primary'
                className={classes.submit}
                onClick={handleSubmit}
                disabled={authenticating}
              >
                Sign In
              </Button>
            </FormControl>
          </div>
        </Container>
      </main>
    </Container>
  )
}

export default connect(state => state)(Login)
