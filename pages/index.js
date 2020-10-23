import React, { useState } from 'react'
import Router from 'next/router'
import { connect } from 'react-redux'
import { wrapper } from '../components/store'
import { fade, makeStyles, useTheme } from '@material-ui/core/styles'
import Link from '../src/Link'
import TopBar from '../components/TopBar'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import { getLangString } from '../components/Lang'
import { useSnackbar } from 'notistack'
import cookie from 'js-cookie'
import axiosClient from '../src/axiosClient'
import {
  Avatar,
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  FormControl,
  FormControlLabel,
  InputLabel,
  Input,
  FormHelperText,
  Button,
  TextField,
  Snackbar
} from '@material-ui/core'

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
        const accessToken =
          response && response.data && response.data.access_token
            ? response.data.access_token
            : ''
        if (accessToken && accessToken.length > 0) {
          enqueueSnackbar(getLangString('login.success', lang), {
            variant: 'success'
          })
          cookie.set('token', accessToken)
          dispatch({ type: 'TOKEN', payload: accessToken })
          Router.push('/reports')
        } else {
          enqueueSnackbar(getLangString('login.failure', lang), {
            variant: 'error'
          })
          Router.push('/')
        }
      })
      .catch(function (error) {
        enqueueSnackbar(getLangString('login.failure', lang) + error, {
          variant: 'error'
        })
        Router.push('/')
      })
  }

  if (token) {
    Router.push('/reports')
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
              {getLangString('login.signIn', lang)}
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
                label={getLangString('login.username', lang)}
                onChange={event => setUsername(event.target.value)}
              />
              <TextField
                variant='outlined'
                margin='normal'
                required
                fullWidth
                name='password'
                type='password'
                id='password'
                label={getLangString('login.password', lang)}
                onChange={event => setPassword(event.target.value)}
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
                {getLangString('login.signIn', lang)}
              </Button>
            </FormControl>
          </div>
        </Container>
      </main>
    </Container>
  )
}

export default connect(state => state)(Login)
