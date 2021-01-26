import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import Router from 'next/router'
import { axiosClient } from '../src/axiosClient'
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
const dateFormat = 'YYYY-MM-DD'
const dateDisplay = 'dddd MMMM DD, YYYY'
import Container from '@material-ui/core/Container'
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import { useSnackbar } from 'notistack'
import cookie from 'js-cookie'
import SyncIcon from '@material-ui/icons/Sync'
import { refreshCompanies } from '../src/refreshCompanies'
import CircularProgress from '@material-ui/core/CircularProgress'
import { green } from '@material-ui/core/colors'
import CheckIcon from '@material-ui/icons/Check'
import Select from 'react-select'
import CancelIcon from '@material-ui/icons/Cancel'
import { utcToZonedTime } from 'date-fns-tz'

const selectStyles = {
  menu: base => ({
    ...base,
    zIndex: 100
  })
}

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
    top: '50%',
    left: '50%'
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
  },
  buttonWrapper: {
    margin: theme.spacing(1),
    position: 'relative'
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700]
    }
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  },
  backgroundModal: {
    backgroundColor: '#EEF',
    border: '1px solid #AAA',
    minWidth: 600
  },
  dialogPaper: {
    overflowY: 'visible'
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
  const [newDialog, setNewDialog] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [companies, setCompanies] = React.useState([])

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success
  })

  const handleCloseDialog = () => {
    setNewDialog(false)
  }

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

  const getCompanies = () => {
    axiosClient({
      method: 'get',
      url: '/companies',
      headers: { Authorization: `Bearer ${token}` }
    }).then(response => {
      let result =
        response.data && Array.isArray(response.data) ? response.data : []
      result = result.map(company => ({
        ...company,
        label: '[' + company.job + '] ' + company.name
      }))
      setCompanies(result)
    })
  }

  const changeShowClosed = () => {
    const newValue = !showClosed
    getData(newValue)
    setShowClosed(newValue)
  }

  const searchReports = event => {
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
      getCompanies()
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

  const createNew = async company => {
    const newReport = {
      archived: false,
      fieldService: company.job ? true : false,
      job: company.job ? company.job : 0,
      date: new Date(moment.tz('America/Los_Angeles').format('YYYY-MM-DD')),
      po: '',
      customerName: company.name ? company.name : '',
      customerStreet: company.addr1 ? company.addr1 : '',
      customerStreet2: company.addr2 ? company.addr2 : '',
      customerCity: company.city ? company.city : '',
      customerState: company.state ? company.state : '',
      customerZip: company.zip ? company.zip : '',
      customerPhone: '',
      machineType: '',
      machineSerial: '',
      machineManufactureDate: '',
      torchHeightControlModel: '',
      torchHeightControlSerial: '',
      positionerSerial: '',
      interfaceSerial: '',
      oxyFuel: false,
      torches: '',
      plasmas: [],
      reportedTrouble: '',
      materialsNeeded: [],
      materialsUsed: [],
      servicePerformed: '',
      issues: [],
      tsheets: [],
      completed: false,
      customerSignature: '',
      customerSignatureDate: null,
      satisfaction: false,
      servicemanSignature: '',
      servicemanSignatureDate: null
    }
    handleCloseDialog()
    createReport(newReport)
  }

  const copyToNew = async existing => {
    var d = new Date()

    const newReport = {
      archived: false,
      fieldService: existing.fieldService ? true : false,
      job:
        existing.satisfaction && existing.customerSignatureDate
          ? 0
          : existing.job
          ? existing.job
          : 0,
      date: new Date(moment.tz('America/Los_Angeles').format('YYYY-MM-DD')),
      po: existing.po ? existing.po : '',
      customerName: existing.customerName ? existing.customerName : '',
      customerStreet: existing.customerStreet ? existing.customerStreet : '',
      customerStreet2: existing.customerStreet2 ? existing.customerStreet2 : '',
      customerCity: existing.customerCity ? existing.customerCity : '',
      customerState: existing.customerState ? existing.customerState : '',
      customerZip: existing.customerZip ? existing.customerZip : '',
      customerPhone: existing.customerPhone ? existing.customerPhone : '',
      machineType: existing.machineType ? existing.machineType : '',
      machineSerial: existing.machineSerial ? existing.machineSerial : '',
      machineManufactureDate: existing.machineManufactureDate
        ? existing.machineManufactureDate
        : '',
      torchHeightControlModel: existing.torchHeightControlModel
        ? existing.torchHeightControlModel
        : '',
      torchHeightControlSerial: existing.torchHeightControlSerial
        ? existing.torchHeightControlSerial
        : '',
      positionerSerial: existing.positionerSerial
        ? existing.positionerSerial
        : '',
      interfaceSerial: existing.interfaceSerial ? existing.interfaceSerial : '',
      oxyFuel: existing.oxyFuel ? existing.oxyFuel : false,
      torches: existing.torches ? existing.torches : '',
      plasmas: existing.plasmas ? existing.plasmas : [],
      reportedTrouble: '',
      materialsNeeded: [],
      materialsUsed: [],
      servicePerformed: '',
      issues: [],
      tsheets: [],
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

  const syncTSheets = async () => {
    if (!loading) {
      setSuccess(false)
      setLoading(true)

      await axiosClient({
        method: 'delete',
        url: '/companies',
        data: {},
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          setSuccess(true)
          setLoading(false)
          getCompanies()
        })
        .catch(error => {
          enqueueSnackbar('TSheets Error:' + error, {
            variant: 'error'
          })
          setLoading(false)
        })
    }
  }

  return (
    <Container>
      <TopBar />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <div className={classes.root}>
          <Grid container direction='row' justify='center' alignItems='center'>
            <Button
              variant='contained'
              color='secondary'
              style={{ margin: 20 }}
              onClick={() => setNewDialog(true)}
              startIcon={<AddCircleOutlineIcon />}
            >
              New Report
            </Button>
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
      <Dialog
        id='deleteConfirmation'
        open={confirmDelete}
        onClose={handleConfirmDeleteClose}
      >
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
      <Dialog
        id='selectCompany'
        fullWidth={true}
        maxWidth={'md'}
        fullHeight={true}
        maxHeight={'md'}
        open={newDialog}
        onClose={handleCloseDialog}
        classes={{
          paperFullWidth: classes.dialogPaper
        }}
      >
        <DialogTitle>Select Company</DialogTitle>
        <DialogContent
          classes={{
            root: classes.dialogPaper
          }}
        >
          <div className={classes.buttonWrapper}>
            <Button
              variant='contained'
              color='secondary'
              className={buttonClassname}
              disabled={loading}
              onClick={syncTSheets}
              startIcon={success ? <CheckIcon /> : <SyncIcon />}
            >
              Sync TSheets
            </Button>
            {loading && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </div>

          <Select
            id='companies'
            instanceId='companies'
            styles={selectStyles}
            className='itemsSelect'
            classNamePrefix='select'
            isClearable={true}
            isSearchable={true}
            onChange={createNew}
            name='companies'
            options={companies}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant='contained'
            color='primary'
            style={{ margin: 10 }}
            onClick={handleCloseDialog}
            startIcon={<CancelIcon />}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            color='secondary'
            style={{ margin: 10 }}
            onClick={() => createNew({})}
            startIcon={<AddCircleOutlineIcon />}
          >
            Create Blank
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
export default connect(state => state)(Page)
