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
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'
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
  IconButton,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogActions
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
    justifyContent: 'center',
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    width: '80%'
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },
  field: {
    margin: 0,
    padding: 0
  },
  iconButton: {
    padding: 0,
    margin: 0
  },
  section: {
    backgroundColor: '#EEF',
    border: '1px solid #AAA',
    margin: '5px',
    padding: '8px'
  },
  textField: {
    margin: 2,
    padding: 2
  },
  textFieldWide: {
    width: '100%',
    margin: 2,
    padding: 2
  },
  checkbox: {
    marginTop: 6,
    marginBottom: 6,
    marginLeft: 16,
    padding: 6
  }
}))

const Page = ({ dispatch, token }) => {
  const classes = useStyles()
  const theme = useTheme()
  const [open, setOpen] = React.useState(false)
  const [user, setUser] = React.useState({})
  const [userToDelete, setUserToDelete] = React.useState({})
  const [users, setUsers] = React.useState([])
  const [confirmDelete, setConfirmDelete] = React.useState(false)
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

  const handleConfirmDeleteClose = () => {
    setUserToDelete({})
    setConfirmDelete(false)
  }

  const confirmUserToDelete = user => {
    setUserToDelete(user)
    setConfirmDelete(true)
  }

  useEffect(() => {
    const roles = cookie.get('roles')
    if (token && token.length > 0 && roles && roles.includes('admin')) {
      getData()
    } else {
      Router.push('/')
    }
  }, [])

  const changeValue = async (name, value) => {
    const updated = {
      ...user,
      [name]: value
    }
    setUser(updated)
  }

  const changeField = event => {
    const fieldName = event.target.name
    const fieldValue = event.target.value
    changeValue(fieldName, fieldValue)
  }

  const changeCheckbox = event => {
    const updated = {
      ...user,
      [event.target.name]: event.target.checked ? 'admin' : ''
    }
    setUser(updated)
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
    handleClose()
  }

  const deleteUser = async () => {
    const user = userToDelete
    if (user) {
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
    handleConfirmDeleteClose()
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
            onClick={handleOpen}
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
                      <IconButton
                        onClick={() => confirmUserToDelete(user)}
                        edge='end'
                      >
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
      <Modal
        id='items'
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <Grid container spacing={1} justify='space-between'>
              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  variant='outlined'
                  name='username'
                  label='User Name'
                  onChange={changeField}
                />
                &nbsp;&nbsp;&nbsp;&nbsp;
                <TextField
                  className={classes.textField}
                  variant='outlined'
                  name='password'
                  label='Password'
                  onChange={changeField}
                />
                &nbsp;&nbsp;&nbsp;&nbsp;
                <FormControlLabel
                  control={
                    <Checkbox
                      className={classes.checkbox}
                      checked={user.roles && user.roles.includes('admin')}
                      onChange={changeCheckbox}
                      name='roles'
                      color='primary'
                    />
                  }
                  label='Admin'
                />
              </Grid>
              <Grid
                container
                direction='row'
                justify='flex-end'
                alignItems='flex-end'
              >
                <Button
                  variant='contained'
                  color='primary'
                  style={{ margin: 10 }}
                  onClick={handleClose}
                  startIcon={<CancelIcon />}
                >
                  Cancel
                </Button>
                <Button
                  variant='contained'
                  color='secondary'
                  style={{ margin: 10 }}
                  onClick={() => createUser(user)}
                  startIcon={<SaveIcon />}
                >
                  Create
                </Button>
              </Grid>
            </Grid>
          </div>
        </Fade>
      </Modal>
      <Dialog open={confirmDelete} onClose={handleConfirmDeleteClose}>
        <DialogTitle>{`Are you sure you want to delete ${user.username}?`}</DialogTitle>
        <DialogActions>
          <Button onClick={handleConfirmDeleteClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={deleteUser} color='secondary' autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default connect(state => state)(Page)
