import React, { useState, useEffect } from 'react'
import Router from 'next/router'
import axiosClient from '../src/axiosClient'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { wrapper } from '../components/store'
import { fade, makeStyles, useTheme } from '@material-ui/core/styles'
import Link from '../src/Link'
import TopBar from '../components/TopBar'
import PersonIcon from '@material-ui/icons/Person'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount'
import DeleteIcon from '@material-ui/icons/Delete'
import numeral from 'numeral'
const priceFormat = '$0.00'
import ReportCard from '../components/ReportCard'
import { flatten } from 'lodash'
import moment from 'moment-timezone'
const dateFormat = 'YYYY-MM-DDTHH:mm:SS'
const dateDisplay = 'dddd MMMM DD, YYYY'
import {
  Container,
  Card,
  Box,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  Button,
  Modal,
  Backdrop,
  Fade,
  TextField,
  IconButton
} from '@material-ui/core'
import { useSnackbar } from 'notistack'
import cookie from 'js-cookie'

const useStyles = makeStyles(theme => ({
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar
  },
  center: {
    textAlign: 'center'
  },
  content: {
    textAlign: 'center',
    flexGrow: 1,
    padding: theme.spacing(7)
  },
  root: {
    flexGrow: 1
  },
  center: {
    textAlign: 'center',
    flexGrow: 1
  },
  lines: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexGrow: 1,
    borderTop: '1px solid #ccc',
    borderLeft: '1px solid #ccc',
    borderRight: '1px solid #ccc',
    '&:last-child': {
      borderBottom: '1px solid #ccc'
    }
  },
  nolines: {
    borderBottom: '2px solid white'
  },
  flexGrid: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexGrow: 1
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  section: {
    backgroundColor: '#EEF',
    border: '1px solid #AAA',
    margin: '5px',
    padding: '8px'
  }
}))

const Page = ({ dispatch, token }) => {
  const classes = useStyles()
  const theme = useTheme()
  const [open, setOpen] = React.useState(false)
  const [users, setUsers] = React.useState([])
  const { enqueueSnackbar } = useSnackbar()

  const getData = () => {
    axiosClient({
      method: 'get',
      url: '/users',
      headers: { Authorization: `Bearer ${token}` }
    }).then(response => {
      const result =
        response.data && Array.isArray(response.data) ? response.data : []
      setUsers(result)
    })
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    if (token && token.length > 0) {
      getData()
    } else {
      //Router.push('/')
    }
  }, [])

  const createNew = async existing => {
    const newUser = {
      username: '',
      password: '',
      roles: ''
    }

    createUser(newUser)
  }

  const createUser = async user => {
    await axiosClient({
      method: 'post',
      url: '/users',
      data: user,
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        enqueueSnackbar('New User Created', {
          variant: 'success'
        })
        getData()
      })
      .catch(error => {
        enqueueSnackbar('Error Creating User: ' + error, {
          variant: 'error'
        })
      })
  }

  const deleteUser = async user => {
    await axiosClient({
      method: 'delete',
      url: `/users/${user._id}`,
      data: user,
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        enqueueSnackbar('User Deleted', {
          variant: 'success'
        })
        getData()
      })
      .catch(error => {
        enqueueSnackbar('Error Deleting User: ' + error, {
          variant: 'error'
        })
      })
  }

  return (
    <Container>
      <TopBar />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <div className={classes.root}>
          <Button
            variant='contained'
            color='secondary'
            style={{ margin: 20 }}
            onClick={createNew}
            startIcon={<PersonAddIcon />}
          >
            New User
          </Button>

          <Box width={1}>
            <Grid>
              <List>
                {users.map((user, index) => (
                  <ListItem key={'user' + index}>
                    <ListItemAvatar>
                      <Typography>
                        {user.roles && user.roles.includes('admin') ? (
                          <SupervisorAccountIcon />
                        ) : (
                          <PersonIcon />
                        )}
                      </Typography>
                    </ListItemAvatar>
                    <ListItemText edge='begin' primary={`${user.username}`} />
                    <ListItemSecondaryAction>
                      <IconButton onClick={() => deleteUser(user)} edge='end'>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Box>
        </div>
      </main>
    </Container>
  )
}

export default connect(state => state)(Page)
