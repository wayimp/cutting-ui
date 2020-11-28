import React, { useState, useEffect } from 'react'
import Router from 'next/router'
import axiosClient from '../src/axiosClient'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { wrapper } from '../components/store'
import { fade, makeStyles, useTheme } from '@material-ui/core/styles'
import Link from '../src/Link'
import TopBar from '../components/TopBar'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import AddLocationIcon from '@material-ui/icons/AddLocation'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import SearchIcon from '@material-ui/icons/Search'
import SendIcon from '@material-ui/icons/Send'
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
  Grid,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
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
  FormControlLabel,
  Button,
  Checkbox,
  Modal,
  Backdrop,
  Fade,
  TextField,
  Dialog,
  DialogTitle,
  DialogActions,
  OutlinedInput,
  InputAdornment,
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
  const [reports, setReports] = React.useState([])
  const [sorted, setSorted] = React.useState([])
  const [days, setDays] = React.useState([])
  const [reportToDelete, setReportToDelete] = React.useState({})
  const [confirmDelete, setConfirmDelete] = React.useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const [showClosed, setShowClosed] = React.useState(false)
  const [search, setSearch] = React.useState('')

  const getData = sc => {
    const url = sc === true ? '/reports?showClosed=true' : '/reports'
    axiosClient({
      method: 'get',
      url,
      headers: { Authorization: `Bearer ${token}` }
    }).then(response => {
      const result =
        response.data && Array.isArray(response.data) ? response.data : []
      setReports(result)
      sortReports(result, search)
    })
  }

  const changeShowClosed = () => {
    const newValue = !showClosed
    getData(newValue)
    setShowClosed(newValue)
  }

  const searchReports = event => {
    const fieldName = event.target.name
    const fieldValue = event.target.value
    setSearch(fieldValue)
    sortReports(reports, fieldValue)
  }

  const sortReports = (unsorted, searchString) => {
    let reportsSorted = unsorted
      .map(report => ({
        ...report,
        daySubmitted: moment(report.date, dateFormat).format(dateDisplay)
      }))
      .sort(function (a, b) {
        const dateA = new Date(a.date),
          dateB = new Date(b.date)
        return dateB - dateA
      })

    if (searchString && searchString.length > 0) {
      reportsSorted = reportsSorted.filter(report => {
        if (
          report.customerName &&
          report.customerName.toLowerCase().includes(searchString.toLowerCase())
        )
          return report
      })
    }

    const days = Array.isArray(reportsSorted)
      ? [...new Set(reportsSorted.map(report => report.daySubmitted))]
      : []

    setSorted(reportsSorted)
    setDays(days)
  }

  useEffect(() => {
    if (token && token.length > 0) {
      getData(showClosed)
    } else {
      Router.push('/')
    }
  }, [])

  const handleConfirmDeleteClose = () => {
    setReportToDelete({})
    setConfirmDelete(false)
  }

  const confirmDeleteReport = report => {
    setReportToDelete(report)
    setConfirmDelete(true)
  }

  const createNew = async existing => {
    const newReport = {
      archived: false,
      job: '',
      date: moment().tz('America/Los_Angeles'),
      po: '',
      customerName: '',
      customerStreet: '',
      customerCity: '',
      customerState: '',
      customerZip: '',
      customerPhone: '',
      machineType: '',
      machineSerial: '',
      control: '',
      controlSerial: '',
      plasmaType: '',
      plasmaModel: '',
      plasmaSerial: '',
      oxyFuel: false,
      torches: '',
      drive: '',
      driveSerial: '',
      reportedTrouble: '',
      materials: [],
      servicePerformed: '',
      issues: [],
      logs: [],
      completed: false,
      customerSignature: '',
      customerSignatureDate: null,
      satisfaction: false,
      servicemanSignature: '',
      servicemanSignatureDate: null
    }

    createReport(newReport)
  }

  const copyToNew = async existing => {
    const newReport = {
      archived: false,
      job: existing.job,
      date: moment().tz('America/Los_Angeles'),
      po: existing.po,
      customerName: existing.customerName,
      customerStreet: existing.customerStreet,
      customerCity: existing.customerCity,
      customerState: existing.customerState,
      customerZip: existing.customerZip,
      customerPhone: existing.customerPhone,
      machineType: existing.machineType,
      machineSerial: existing.machineSerial,
      control: existing.control,
      controlSerial: existing.controlSerial,
      plasmaType: existing.plasmaType,
      plasmaModel: existing.plasmaModel,
      plasmaSerial: existing.plasmaSerial,
      oxyFuel: existing.oxyFuel,
      torches: existing.torches,
      drive: existing.drive,
      driveSerial: existing.driveSerial,
      reportedTrouble: '',
      materials: [],
      servicePerformed: '',
      issues: [],
      logs: [],
      completed: false,
      customerSignature: '',
      customerSignatureDate: null,
      satisfaction: false,
      servicemanSignature: '',
      servicemanSignatureDate: null
    }

    createReport(newReport)
  }

  const createReport = async report => {
    await axiosClient({
      method: 'post',
      url: '/reports',
      data: report,
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        enqueueSnackbar('New Report Created', {
          variant: 'success'
        })
        getData(showClosed)
      })
      .catch(error => {
        enqueueSnackbar('Error Creating Report: ' + error, {
          variant: 'error'
        })
      })
  }

  const archiveReport = async () => {
    const report = {
      ...reportToDelete,
      archived: true
    }
    await axiosClient({
      method: 'patch',
      url: '/reports',
      data: report,
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        enqueueSnackbar('Report Archived', {
          variant: 'success'
        })
        getData(showClosed)
      })
      .catch(error => {
        enqueueSnackbar('Error Archiving Report: ' + error, {
          variant: 'error'
        })
      })
    handleConfirmDeleteClose()
  }

  return (
    <Container>
      <TopBar />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <div className={classes.root}>
          <Grid container direction='row' justify='center' alignItems='center'>
            <FormControl variant='outlined'>
              <InputLabel>Search</InputLabel>
              <OutlinedInput
                id='search'
                value={search}
                onChange={searchReports}
                startAdornment={
                  <InputAdornment position='start'>
                    <SearchIcon />
                  </InputAdornment>
                }
                labelWidth={70}
              />
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  className={classes.checkbox}
                  checked={showClosed}
                  onChange={changeShowClosed}
                  name='showClosed'
                  color='secondary'
                />
              }
              label='Show Closed'
            />
            <Button
              variant='contained'
              color='secondary'
              style={{ margin: 20 }}
              onClick={createNew}
              startIcon={<AddCircleOutlineIcon />}
            >
              New Report
            </Button>
          </Grid>

          {days.map(day => (
            <Card key={day} className={classes.section}>
              <h3>{day}</h3>
              <Grid
                container
                spacing={2}
                direction='row'
                justify='flex-start'
                alignItems='flex-start'
              >
                {sorted
                  .filter(report => report.daySubmitted === day)
                  .map(report => (
                    <ReportCard
                      key={report._id}
                      report={report}
                      copyToNew={copyToNew}
                      archive={confirmDeleteReport}
                    />
                  ))}
              </Grid>
            </Card>
          ))}
        </div>
      </main>
      <Dialog open={confirmDelete} onClose={handleConfirmDeleteClose}>
        <DialogTitle>{`Are you sure you want to delete this report?`}</DialogTitle>
        <DialogActions>
          <Button onClick={handleConfirmDeleteClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={archiveReport} color='secondary' autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default connect(state => state)(Page)
