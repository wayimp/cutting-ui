import React, { useState, useEffect } from 'react'
import Router from 'next/router'
import axiosClient from '../src/axiosClient'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { wrapper } from '../components/store'
import { fade, makeStyles, useTheme } from '@material-ui/core/styles'
import { getLangString } from '../components/Lang'
import Link from '../src/Link'
import TopBar from '../components/TopBar'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import AddLocationIcon from '@material-ui/icons/AddLocation'
import LocationOnIcon from '@material-ui/icons/LocationOn'
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
  Button,
  Modal,
  Backdrop,
  Fade,
  TextField
} from '@material-ui/core'
import {
  Map as GoogleMap,
  InfoWindow,
  Marker,
  GoogleApiWrapper
} from 'google-maps-react'
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

const Page = ({ dispatch, lang, cart, google, token }) => {
  const classes = useStyles()
  const theme = useTheme()
  const langSuffix = lang ? lang.substring(0, 2) : 'en'
  const [open, setOpen] = React.useState(false)
  const [reports, setReports] = React.useState([])
  const { enqueueSnackbar } = useSnackbar()

  const getData = () => {
    axiosClient({
      method: 'get',
      url: '/reports',
      headers: { Authorization: `Bearer ${token}` }
    }).then(response => {
      const result =
        response.data && Array.isArray(response.data) ? response.data : []
      setReports(result)
    })
  }

  const reportsSorted = reports
    .map(report => ({
      ...report,
      daySubmitted: moment(report.date, dateFormat).format(dateDisplay)
    }))
    .sort(function (a, b) {
      const dateA = new Date(a.date),
        dateB = new Date(b.date)
      return dateB - dateA
    })

  const days = Array.isArray(reportsSorted)
    ? [...new Set(reportsSorted.map(report => report.daySubmitted))]
    : []

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
      Router.push('/')
    }
  }, [reports])

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
        getData()
      })
      .catch(error => {
        enqueueSnackbar('Error Creating Report: ' + error, {
          variant: 'error'
        })
      })
  }

  const archiveReport = async report => {
    report.archived = true
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
        getData()
      })
      .catch(error => {
        enqueueSnackbar('Error Archiving Report: ' + error, {
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
            startIcon={<AddCircleOutlineIcon />}
          >
            New Report
          </Button>
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
                {reportsSorted
                  .filter(report => report.daySubmitted === day)
                  .map(report => (
                    <ReportCard
                      key={report._id}
                      report={report}
                      copyToNew={copyToNew}
                      archive={archiveReport}
                    />
                  ))}
              </Grid>
            </Card>
          ))}
        </div>
      </main>
    </Container>
  )
}

export default connect(state => state)(Page)
