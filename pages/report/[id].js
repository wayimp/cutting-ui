import React, { useState, useEffect } from 'react'
import { axiosClient, baseURL } from '../../src/axiosClient'
import { useSnackbar } from 'notistack'
import { connect } from 'react-redux'
import { flatten } from 'lodash'
import { fade, makeStyles, useTheme } from '@material-ui/core/styles'
import Link from '../../src/Link'
import TopBar from '../../components/TopBar'
import TabPanel from '../../components/TabPanel'
import numeral from 'numeral'
const priceFormat = '$0.00'
import moment from 'moment-timezone'
const dateFormat = 'YYYY-MM-DDTHH:mm:SS'
const dateDisplay = 'dddd MMM DD hh:mm a'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Switch from '@material-ui/core/Switch'
import Grid from '@material-ui/core/Grid'
import Checkbox from '@material-ui/core/Checkbox'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import IconButton from '@material-ui/core/IconButton'
import Modal from '@material-ui/core/Modal'
import Tooltip from '@material-ui/core/Tooltip'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted'
import CancelIcon from '@material-ui/icons/Cancel'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline'
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera'
import PlayForWorkIcon from '@material-ui/icons/PlayForWork'
import MailOutlineIcon from '@material-ui/icons/MailOutline'
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf'
import EmailIcon from '@material-ui/icons/Email'
import SendIcon from '@material-ui/icons/Send'
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered'
import DateFnsUtils from '@date-io/date-fns'
import {
  MuiPickersUtilsProvider,
  TimePicker,
  DatePicker
} from '@material-ui/pickers'
import Select from 'react-select'
import Webcam from 'react-webcam'
import AWS from 'aws-sdk'
const spacesEndpoint = new AWS.Endpoint(process.env.SPACES_ENDPOINT)
const s3 = new AWS.S3({
  endpoint: process.env.SPACES_ENDPOINT,
  accessKeyId: process.env.SPACES_KEY,
  secretAccessKey: process.env.SPACES_SECRET
})

Array.prototype.sum = function (prop) {
  var total = 0
  for (var i = 0, _len = this.length; i < _len; i++) {
    if (this[i] && this[i][prop]) {
      total += this[i][prop]
    }
  }
  return total
}

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
  formGroup: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fafafa',
    border: '1px solid #ccc'
  },
  formGroupTop: {
    margin: 20,
    padding: 20
  },
  center: {
    textAlign: 'center'
  },
  content: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexGrow: 1,
    paddingRight: theme.spacing(5)
  },
  root: {
    padding: 0,
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
      reportBottom: '1px solid #ccc'
    }
  },
  nolines: {
    reportBottom: '2px solid white'
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
  modalButton: {
    position: 'absolute',
    top: 6,
    left: 6,
    display: 'block',
    width: 'auto',
    height: 'auto'
  },
  button: {
    margin: theme.spacing(1)
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
  },
  iconButton: {
    margin: -2,
    padding: -2
  },
  tabPanel: {
    border: 1,
    backgroundColor: theme.palette.background.paper
  },
  img: {
    border: 1,
    margin: 5
  },
  gridListRoot: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper
  },
  gridList: {
    height: 550,
    flexWrap: 'nowrap',
    transform: 'translateZ(0)'
  },
  titleBar: {
    background:
      'linear-gradient(to right, rgba(0,0,0,0.7) 0%, ' + 'rgba(0,0,0,0) 20%)'
  },
  icon: {
    color: 'white'
  }
}))

const Report = ({ propsReport, propsSent, propsOptions, dispatch, token }) => {
  const classes = useStyles()
  const theme = useTheme()
  const [report, setReport] = React.useState(propsReport)
  const [readOnly, setReadOnly] = React.useState(true)
  const [reportEdit, setReportEdit] = useState({})
  const { enqueueSnackbar } = useSnackbar()
  const [addIssue, setAddIssue] = React.useState('')
  const [itemNoNeeded, setItemNoNeeded] = React.useState('')
  const [itemDescNeeded, setItemDescNeeded] = React.useState('')
  const [itemNoUsed, setItemNoUsed] = React.useState('')
  const [itemDescUsed, setItemDescUsed] = React.useState('')
  const [selectedTab, setSelectedTab] = React.useState(0)
  const [openWebcam, setOpenWebcam] = React.useState(false)
  const [openEmail, setOpenEmail] = React.useState(false)
  const [email, setEmail] = React.useState({})
  const [sentEmails, setSentEmails] = React.useState(propsSent)

  const handleRequisitionOpen = () => {
    let body = `${report.customerName} (${report.job})\n${window.location.href}\n\nPlease order the following items:\n\n`

    report.materialsNeeded.map((material, mi) => {
      body +=
        '(' +
        material.quantity +
        'x) ' +
        material.item +
        '\n' +
        material.description +
        '\n\n'
    })

    const emailTemplate = {
      readOnly: false,
      action: 'Requisition',
      to: 'Kat Earnest <kat@valleycuttingsystems.com>',
      subject: `Requisition Request for ${report.customerName}`,
      body
    }

    setEmail(emailTemplate)

    setOpenEmail(true)
  }

  const handleIssuesOpen = () => {
    let body = `Follow Up Issues from Service Report: \n${window.location.href}\n\n`

    report.issues.map((issue, ii) => {
      body +=
        ii +
        1 +
        '. ' +
        (issue.resolved ? '[Done] ' : '') +
        issue.description +
        '\n\n'
    })

    const emailTemplate = {
      readOnly: false,
      action: 'ToDo',
      to: 'Kat Earnest <kat@valleycuttingsystems.com>',
      subject: `Follow-Up Issues for ${report.customerName}`,
      body
    }

    setEmail(emailTemplate)

    setOpenEmail(true)
  }

  const handlePdfOpen = () => {
    let body = `Your service report is available here: ${window.location.href}\n\nPDF version: ${baseURL}/pdf/${report._id}`

    const emailTemplate = {
      readOnly: false,
      action: 'PDF',
      to: `${report.customerName} <${report.customerEmail}>`,
      subject: 'Printable Service Report from Valley Cutting Systems',
      body
    }

    setEmail(emailTemplate)

    setOpenEmail(true)
  }

  const displayEmailSent = sent => {
    sent.readOnly = true
    setEmail(sent)
    setOpenEmail(true)
  }

  const handleEmailClose = () => {
    const emailTemplate = {
      readOnly: true,
      action: '',
      to: '',
      subject: '',
      body: ''
    }

    setOpenEmail(false)
    setEmail(emailTemplate)
  }

  const changeEmail = event => {
    const fieldName = event.target.name
    const fieldValue = event.target.value

    const updated = {
      ...email,
      [fieldName]: fieldValue
    }
    setEmail(updated)
  }

  const sendEmail = async () => {
    const emailToSend = {
      action: email.action,
      to: email.to,
      body: email.body,
      subject: email.subject,
      reportId: report._id
    }

    await axiosClient
      .post('/emails', emailToSend)
      .then(res => {
        enqueueSnackbar('Email Sent', {
          variant: 'success'
        })

        const updated = [emailToSend].concat(sentEmails)
        setSentEmails(updated)

        handleEmailClose()
      })
      .catch(err => {
        enqueueSnackbar('Problem Sending Email: ' + err, {
          variant: 'error'
        })
        handleEmailClose()
      })
  }

  const addPlasma = () => {
    const plasma = {
      plasmaType: '',
      plasmaModel: '',
      plasmaSerial: '',
      gasConsoleSerial: '',
      gasConsoleManufactureDate: '',
      powerSupply: ''
    }
    const updated = {
      ...report,
      plasmas: report.plasmas.concat(plasma)
    }
    setReport(updated)
    updateReport(updated)
  }

  const removePlasma = index => {
    const updated = {
      ...report,
      plasmas: report.plasmas
        .map((plasma, i) => {
          if (i === index) return null
          else return plasma
        })
        .filter(notNull => notNull)
    }
    setReport(updated)
    updateReport(updated)
  }

  const changePlasma = (index, event) => {
    const fieldName = event.target.name
    const fieldValue = event.target.value
    const updated = {
      ...report,
      plasmas: report.plasmas.map((plasma, i) => {
        if (i === index) return { ...plasma, [fieldName]: fieldValue }
        else return plasma
      })
    }
    setReport(updated)
    updateReport(updated)
  }

  let webcamRef
  const setRef = webcam => {
    webcamRef = webcam
  }

  const capture = async () => {
    try {
      const imageSrc = webcamRef.getScreenshot()
      addPhoto(imageSrc)
      handleCloseWebcam()
    } catch (err) {
      alert('err' + err)
    }
  }

  const addPhoto = src => {
    const photos = report.photos ? report.photos : []
    const updated = {
      ...report,
      photos: photos.concat(src)
    }
    setReport(updated)
    updateReport(updated)
  }

  const removePhoto = index => {
    const photos = report.photos
      .map((photo, i) => {
        if (i !== index) return photo
      })
      .filter(noNull => noNull)

    const updated = {
      ...report,
      photos
    }
    setReport(updated)
    updateReport(updated)
  }

  const onUnload = () => {
    // This does not work, because the state is stale (reflecting previous state)
    // updateReport(report)
  }

  const handleCloseWebcam = () => {
    setOpenWebcam(false)
  }

  useEffect(() => {
    document.title = report.customerName

    if (report.customerSignatureDate) {
      setReadOnly(true)
    } else {
      setReadOnly(false)
    }

    /*
    window.addEventListener('unload', onUnload)
    return () => {
      window.removeEventListener('unload', onUnload)
    }
    */
  }, [])

  const changeValue = async (name, value) => {
    const updated = {
      ...report,
      [name]: value
    }
    setReport(updated)
  }

  const changeDate = date => {
    const fieldName = 'date'
    const fieldValue = date
    changeValue(fieldName, fieldValue)
  }

  const changeField = event => {
    const fieldName = event.target.name
    const fieldValue = event.target.value

    changeValue(fieldName, fieldValue)
  }

  const changeFieldServicemanSignature = event => {
    const fieldValue = event.target.value
    const updated = {
      ...report,
      servicemanSignature: fieldValue,
      servicemanSignatureDate: moment().format('MM/DD/YYYY')
    }
    setReport(updated)
  }

  const changeFieldCustomerSignature = event => {
    const fieldValue = event.target.value
    const updated = {
      ...report,
      customerSignature: fieldValue,
      customerSignatureDate: moment().format('MM/DD/YYYY')
    }
    setReport(updated)
  }

  const blurField = event => {
    if (!readOnly) {
      updateReport(report)
    }
  }

  const changeCheckbox = event => {
    const updated = {
      ...report,
      [event.target.name]: event.target.checked
    }
    setReport(updated)
    updateReport(updated)
  }

  const selectMaterialOption = (needed, option) => {
    // Translate this from an option to a material
    if (!option) return
    const material = {
      quantity: 1,
      type: option.type,
      item: option.value,
      description: option.label
    }
    const updated = {
      ...report,
      [needed ? 'materialsNeeded' : 'materialsUsed']: [material].concat(
        report[needed ? 'materialsNeeded' : 'materialsUsed']
      )
    }
    setReport(updated)
    updateReport(updated)
  }

  const addNewMaterial = needed => {
    if (
      (needed && (itemNoNeeded || itemDescNeeded)) ||
      (!needed && (itemNoUsed || itemDescUsed))
    ) {
      const material = {
        quantity: 1,
        item: needed ? itemNoNeeded : itemNoUsed,
        description: needed ? itemDescNeeded : itemDescUsed
      }
      const updated = {
        ...report,
        [needed ? 'materialsNeeded' : 'materialsUsed']: [material].concat(
          report[needed ? 'materialsNeeded' : 'materialsUsed']
        )
      }
      if (needed) {
        setItemNoNeeded('')
        setItemDescNeeded('')
      } else {
        setItemNoUsed('')
        setItemDescUsed('')
      }
      setReport(updated)
      updateReport(updated)
    }
  }

  const addMaterial = (needed, index) => {
    const updated = {
      ...report,
      [needed ? 'materialsNeeded' : 'materialsUsed']: report[
        needed ? 'materialsNeeded' : 'materialsUsed'
      ].map((material, i) => {
        if (i === index) material.quantity += 1
        return material
      })
    }
    setReport(updated)
    updateReport(updated)
  }

  const removeMaterial = (needed, index) => {
    const updated = {
      ...report,
      [needed ? 'materialsNeeded' : 'materialsUsed']: report[
        needed ? 'materialsNeeded' : 'materialsUsed'
      ]
        .map((material, i) => {
          if (i === index) {
            material.quantity -= 1
          }
          if (material.quantity < 1) {
            return null
          } else {
            return material
          }
        })
        .filter(notNull => notNull)
    }
    setReport(updated)
    updateReport(updated)
  }

  const moveMaterialToUsed = index => {
    const materialToMove = report.materialsNeeded[index]
    const updated = {
      ...report,
      materialsNeeded: report.materialsNeeded.filter(
        (material, mi) => mi !== index
      ),
      materialsUsed: [materialToMove].concat(report.materialsUsed)
    }
    setReport(updated)
    updateReport(updated)
  }

  const changeAddIssue = event => {
    setAddIssue(event.target.value)
  }

  const addNewIssue = event => {
    if (addIssue) {
      const issueObject = { description: addIssue, resolved: false }
      const updated = {
        ...report,
        issues: report.issues.concat(issueObject)
      }
      setReport(updated)
      updateReport(updated)
      setAddIssue('')
    }
  }

  const issueResolved = index => {
    const updated = {
      ...report,
      issues: report.issues.map((issue, i) => {
        if (i === index) issue.resolved = !issue.resolved
        return issue
      })
    }
    setReport(updated)
    updateReport(updated)
  }

  const removeIssue = index => {
    const updated = {
      ...report,
      issues: report.issues
        .map((issue, i) => {
          if (i === index) return null
          else return issue
        })
        .filter(notNull => notNull)
    }
    setReport(updated)
    updateReport(updated)
  }

  const updateReport = async updateReport => {
    await axiosClient
      .patch('/reports', updateReport)
      .then(res => {
        /*
        enqueueSnackbar('Report Updated', {
          variant: 'success'
        })
        */
        setReport(updateReport)
      })
      .catch(err => {
        enqueueSnackbar('Update Error', {
          variant: 'error'
        })
      })
  }

  return (
    <Container className={classes.root}>
      <TopBar fieldService={report.fieldService ? true : false} />
      <div className={classes.content}>
        <Grid
          container
          direction='row'
          spacing={2}
          alignItems='flex-end'
          justify='space-between'
          className={classes.formGroupTop}
        >
          <Grid item>
            <FormControlLabel
              control={
                <Switch
                  disabled={readOnly}
                  checked={report.fieldService ? true : false}
                  onChange={changeCheckbox}
                  name='fieldService'
                />
              }
              label='Field Service'
            />
            {report.fieldService ? (
              <TextField
                className={classes.textField}
                name='job'
                label='Job#'
                disabled={readOnly}
                defaultValue={report.job ? report.job : ''}
                onChange={changeField}
                onBlur={blurField}
              />
            ) : (
              ''
            )}
          </Grid>
          <Grid item>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker
                autoOk
                disableFuture
                variant='inline'
                format='MM/dd/yyyy'
                id='date'
                label='Date'
                value={Date(report.date)}
                onChange={changeDate}
                onBlur={blurField}
                disabled={readOnly}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item>
            <TextField
              className={classes.textField}
              name='po'
              label='PO#'
              defaultValue={report.po ? report.po : ''}
              onChange={changeField}
              onBlur={blurField}
              disabled={readOnly}
            />
          </Grid>
        </Grid>
        <Grid
          container
          direction='row'
          spacing={2}
          justify='space-between'
          className={classes.formGroup}
        >
          <Grid item>
            <TextField
              className={classes.textField}
              variant='outlined'
              name='customerName'
              label='Customer Name'
              defaultValue={report.customerName ? report.customerName : ''}
              onChange={changeField}
              onBlur={blurField}
              disabled={readOnly}
            />
          </Grid>
          <Grid item>
            <TextField
              className={classes.textField}
              variant='outlined'
              name='customerStreet'
              label='Street Address'
              defaultValue={report.customerStreet ? report.customerStreet : ''}
              onChange={changeField}
              onBlur={blurField}
              disabled={readOnly}
            />
          </Grid>
          <Grid item>
            <TextField
              className={classes.textField}
              variant='outlined'
              name='customerCity'
              label='City'
              defaultValue={report.customerCity ? report.customerCity : ''}
              onChange={changeField}
              onBlur={blurField}
              disabled={readOnly}
            />
          </Grid>
          <Grid item>
            <TextField
              className={classes.textField}
              variant='outlined'
              name='customerState'
              label='State'
              defaultValue={report.customerState ? report.customerState : ''}
              onChange={changeField}
              onBlur={blurField}
              disabled={readOnly}
            />
          </Grid>
          <Grid item>
            <TextField
              className={classes.textField}
              variant='outlined'
              name='customerZip'
              label='Zip'
              defaultValue={report.customerZip ? report.customerZip : ''}
              onChange={changeField}
              onBlur={blurField}
              disabled={readOnly}
            />
          </Grid>
          <Grid item>
            <TextField
              className={classes.textField}
              variant='outlined'
              name='customerPhone'
              label='Phone'
              defaultValue={report.customerPhone ? report.customerPhone : ''}
              onChange={changeField}
              onBlur={blurField}
              disabled={readOnly}
            />
          </Grid>
        </Grid>
        <Grid
          container
          direction='row'
          spacing={2}
          justify='space-between'
          className={classes.formGroup}
        >
          <Grid item>
            <TextField
              className={classes.textField}
              variant='outlined'
              name='machineType'
              label='Machine Type'
              defaultValue={report.machineType ? report.machineType : ''}
              onChange={changeField}
              onBlur={blurField}
              disabled={readOnly}
            />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <TextField
              className={classes.textField}
              variant='outlined'
              name='machineSerial'
              label='Machine Serial'
              defaultValue={report.machineSerial ? report.machineSerial : ''}
              onChange={changeField}
              onBlur={blurField}
              disabled={readOnly}
            />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <TextField
              className={classes.textField}
              variant='outlined'
              name='machinePowerSupply'
              label='Power Supply'
              defaultValue={
                report.machinePowerSupply ? report.machinePowerSupply : ''
              }
              onChange={changeField}
              onBlur={blurField}
              disabled={readOnly}
            />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <TextField
              className={classes.textField}
              variant='outlined'
              name='machineManufactureDate'
              label='Manufacture Date'
              defaultValue={
                report.machineManufactureDate
                  ? report.machineManufactureDate
                  : ''
              }
              onChange={changeField}
              onBlur={blurField}
              disabled={readOnly}
            />
          </Grid>
          <Grid item>
            <TextField
              className={classes.textField}
              variant='outlined'
              name='torchHeightControlModel'
              label='Control Model'
              defaultValue={
                report.torchHeightControlModel
                  ? report.torchHeightControlModel
                  : ''
              }
              onChange={changeField}
              onBlur={blurField}
              disabled={readOnly}
            />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <TextField
              className={classes.textField}
              variant='outlined'
              name='torchHeightControlSerial'
              label='Control Serial'
              defaultValue={
                report.torchHeightControlSerial
                  ? report.torchHeightControlSerial
                  : ''
              }
              onChange={changeField}
              onBlur={blurField}
              disabled={readOnly}
            />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <TextField
              className={classes.textField}
              variant='outlined'
              name='positionerSerial'
              label='Positioner Serial'
              defaultValue={
                report.positionerSerial ? report.positionerSerial : ''
              }
              onChange={changeField}
              onBlur={blurField}
              disabled={readOnly}
            />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <TextField
              className={classes.textField}
              variant='outlined'
              name='interfaceSerial'
              label='User Interface Serial'
              defaultValue={
                report.interfaceSerial ? report.interfaceSerial : ''
              }
              onChange={changeField}
              onBlur={blurField}
              disabled={readOnly}
            />
          </Grid>
          <Grid item>
            <TextField
              className={classes.textField}
              variant='outlined'
              name='driveModel'
              label='Drive Model'
              defaultValue={report.driveModel ? report.driveModel : ''}
              onChange={changeField}
              onBlur={blurField}
              disabled={readOnly}
            />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <TextField
              className={classes.textField}
              variant='outlined'
              name='driveSerial'
              label='Drive Serial'
              defaultValue={report.driveSerial ? report.driveSerial : ''}
              onChange={changeField}
              onBlur={blurField}
              disabled={readOnly}
            />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <TextField
              className={classes.textField}
              variant='outlined'
              name='torches'
              label='Torches'
              type='number'
              defaultValue={report.torches ? report.torches : ''}
              onChange={changeField}
              onBlur={blurField}
              disabled={readOnly}
            />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <FormControlLabel
              control={
                <Checkbox
                  className={classes.checkbox}
                  checked={report.oxyFuel}
                  onChange={changeCheckbox}
                  name='oxyFuel'
                  color='primary'
                  disabled={readOnly}
                />
              }
              label='Oxy Fuel'
            />
          </Grid>
          <Box width={1}>
            <Grid item xs={12}>
              <Typography style={{ margin: 6 }}>
                Plasma Systems
                <Tooltip title='Add new Plasma System'>
                  <IconButton
                    onClick={() => addPlasma()}
                    edge='end'
                    disabled={readOnly}
                  >
                    <AddCircleOutlineIcon />
                  </IconButton>
                </Tooltip>
              </Typography>
            </Grid>
            <Grid>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <List dense={true}>
                  {report.plasmas.map((plasma, index) => (
                    <ListItem key={'plasma' + index}>
                      <ListItemText>
                        <Grid
                          container
                          direction='row'
                          spacing={1}
                          justify='space-between'
                          className={classes.formGroup}
                        >
                          <TextField
                            className={classes.textField}
                            variant='outlined'
                            name='plasmaType'
                            label='Type'
                            defaultValue={plasma.plasmaType}
                            onChange={event => changePlasma(index, event)}
                            onBlur={blurField}
                            disabled={readOnly}
                          />
                          <TextField
                            className={classes.textField}
                            variant='outlined'
                            name='powerSupply'
                            label='Power Supply'
                            defaultValue={plasma.powerSupply}
                            onChange={event => changePlasma(index, event)}
                            onBlur={blurField}
                            disabled={readOnly}
                          />
                          <TextField
                            className={classes.textField}
                            variant='outlined'
                            name='plasmaModel'
                            label='Model'
                            defaultValue={plasma.plasmaModel}
                            onChange={event => changePlasma(index, event)}
                            onBlur={blurField}
                            disabled={readOnly}
                          />
                          <TextField
                            className={classes.textField}
                            variant='outlined'
                            name='plasmaSerial'
                            label='Plasma Serial'
                            defaultValue={plasma.plasmaSerial}
                            onChange={event => changePlasma(index, event)}
                            onBlur={blurField}
                            disabled={readOnly}
                          />
                          <TextField
                            className={classes.textField}
                            variant='outlined'
                            name='gasConsoleSerial'
                            label='Gas Serial'
                            defaultValue={plasma.gasConsoleSerial}
                            onChange={event => changePlasma(index, event)}
                            onBlur={blurField}
                            disabled={readOnly}
                          />
                          <TextField
                            className={classes.textField}
                            variant='outlined'
                            name='gasConsoleManufactureDate'
                            label='Gas Manufacture Date'
                            defaultValue={plasma.gasConsoleManufactureDate}
                            onChange={event => changePlasma(index, event)}
                            onBlur={blurField}
                            disabled={readOnly}
                          />
                        </Grid>
                      </ListItemText>
                      <ListItemSecondaryAction>
                        <Tooltip title='Delete Plasma System'>
                          <IconButton
                            onClick={() => removePlasma(index)}
                            edge='end'
                            disabled={readOnly}
                          >
                            <RemoveCircleOutlineIcon />
                          </IconButton>
                        </Tooltip>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </MuiPickersUtilsProvider>
            </Grid>
          </Box>
        </Grid>

        <Grid
          container
          direction='row'
          spacing={2}
          justify='space-between'
          className={classes.formGroup}
        >
          <Box width={1}>
            <Grid item>
              <TextField
                className={classes.textFieldWide}
                multiline={true}
                variant='outlined'
                name='reportedTrouble'
                label='Reported Trouble'
                defaultValue={
                  report.reportedTrouble ? report.reportedTrouble : ''
                }
                onChange={changeField}
                onBlur={blurField}
                disabled={readOnly}
              />
            </Grid>
          </Box>
        </Grid>
        <Box width={1}>
          <Grid
            container
            direction='row'
            spacing={2}
            justify='space-between'
            className={classes.formGroup}
          >
            <Grid item xs={12}>
              <Typography style={{ margin: 6 }}>Materials Needed</Typography>
              <Select
                id='materialsNeeded'
                instanceId='materialsNeeded'
                styles={selectStyles}
                className='itemsSelect'
                classNamePrefix='select'
                isClearable={true}
                isSearchable={true}
                onChange={option => selectMaterialOption(true, option)}
                name='materialsNeeded'
                options={propsOptions}
                isDisabled={readOnly}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                className={classes.textField}
                variant='outlined'
                name='itemNo'
                label='Item Number'
                value={itemNoNeeded}
                onChange={event => setItemNoNeeded(event.target.value)}
                disabled={readOnly}
              />
              &nbsp;&nbsp;&nbsp;&nbsp;
              <TextField
                className={classes.textField}
                variant='outlined'
                name='itemDesc'
                label='Item Description'
                value={itemDescNeeded}
                onChange={event => setItemDescNeeded(event.target.value)}
                disabled={readOnly}
              />
              <IconButton
                style={{ marginTop: 6 }}
                onClick={() => addNewMaterial(true)}
                disabled={readOnly}
              >
                <AddCircleOutlineIcon />
              </IconButton>
            </Grid>
            <Grid item xs={12}>
              <List>
                {report.materialsNeeded.map((material, index) => (
                  <ListItem key={'material' + index}>
                    <ListItemAvatar>
                      <Grid
                        container
                        direction='row'
                        justify='flex-start'
                        alignItems='center'
                        spacing={0}
                      >
                        <Typography>{material.quantity.toString()}</Typography>
                        <IconButton
                          onClick={() => addMaterial(true, index)}
                          disabled={readOnly}
                        >
                          <AddCircleOutlineIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => removeMaterial(true, index)}
                          disabled={readOnly}
                        >
                          <RemoveCircleOutlineIcon />
                        </IconButton>
                        <Tooltip title='Move to Materials Used'>
                          <IconButton
                            onClick={() => moveMaterialToUsed(index)}
                            disabled={readOnly}
                          >
                            <PlayForWorkIcon />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </ListItemAvatar>
                    <ListItemText
                      edge='begin'
                      primary={`${material.item}`}
                      secondary={`${material.description}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12}>
              <IconButton
                onClick={handleRequisitionOpen}
                style={{ marginTop: 6 }}
                disabled={readOnly}
                color='secondary'
              >
                <MailOutlineIcon />
                &nbsp;Requisition
              </IconButton>
              <List>
                {sentEmails.map(sent =>
                  sent.action === 'Requisition' ? (
                    <ListItem key={sent._id}>
                      <ListItemText>
                        <IconButton
                          onClick={() => displayEmailSent(sent)}
                          style={{ marginTop: 6 }}
                          color='secondary'
                        >
                          <EmailIcon />
                          &nbsp;
                          {moment(sent.sent)
                            .tz('America/Los_Angeles')
                            .format(dateDisplay)}
                        </IconButton>
                      </ListItemText>
                    </ListItem>
                  ) : (
                    ''
                  )
                )}
              </List>
            </Grid>
          </Grid>
        </Box>
        <Box width={1}>
          <Grid
            container
            direction='row'
            spacing={2}
            justify='space-between'
            className={classes.formGroup}
          >
            <Grid item xs={12}>
              <Typography style={{ margin: 6 }}>Materials Used</Typography>
              <Select
                id='materialsUsed'
                instanceId='materialsUsed'
                styles={selectStyles}
                className='itemsSelect'
                classNamePrefix='select'
                isClearable={true}
                isSearchable={true}
                onChange={option => selectMaterialOption(false, option)}
                name='materialsUsed'
                options={propsOptions}
                isDisabled={readOnly}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                className={classes.textField}
                variant='outlined'
                name='itemNo'
                label='Item Number'
                value={itemNoUsed}
                onChange={event => setItemNoUsed(event.target.value)}
                disabled={readOnly}
              />
              &nbsp;&nbsp;&nbsp;&nbsp;
              <TextField
                className={classes.textField}
                variant='outlined'
                name='itemDesc'
                label='Item Description'
                value={itemDescUsed}
                onChange={event => setItemDescUsed(event.target.value)}
                disabled={readOnly}
              />
              <IconButton
                style={{ marginTop: 6 }}
                onClick={() => addNewMaterial(false)}
                disabled={readOnly}
              >
                <AddCircleOutlineIcon />
              </IconButton>
            </Grid>
            <Grid item xs={12}>
              <List>
                {report.materialsUsed.map((material, index) => (
                  <ListItem key={'material' + index}>
                    <ListItemAvatar>
                      <Grid
                        container
                        direction='row'
                        justify='flex-start'
                        alignItems='center'
                        spacing={0}
                      >
                        <Typography>{material.quantity.toString()}</Typography>
                        <IconButton
                          onClick={() => addMaterial(false, index)}
                          disabled={readOnly}
                        >
                          <AddCircleOutlineIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => removeMaterial(false, index)}
                          disabled={readOnly}
                        >
                          <RemoveCircleOutlineIcon />
                        </IconButton>
                      </Grid>
                    </ListItemAvatar>
                    <ListItemText
                      edge='begin'
                      primary={`${material.item}`}
                      secondary={`${material.description}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </Box>
        <Grid
          container
          direction='row'
          spacing={2}
          justify='space-between'
          className={classes.formGroup}
        >
          <Box width={1}>
            <Grid item>
              <TextField
                className={classes.textFieldWide}
                multiline={true}
                variant='outlined'
                name='servicePerformed'
                label='Service Performed'
                defaultValue={
                  report.servicePerformed ? report.servicePerformed : ''
                }
                onChange={changeField}
                onBlur={blurField}
                disabled={readOnly}
              />
            </Grid>
          </Box>
        </Grid>
        <Grid
          container
          direction='row'
          spacing={2}
          justify='space-between'
          className={classes.formGroup}
        >
          <Box width={1}>
            <Grid item>
              <Typography style={{ margin: 6 }}>Follow-Up Issues</Typography>
              <Box width={1}>
                <TextField
                  variant='outlined'
                  name='addIssue'
                  label='Add Issue'
                  onChange={changeAddIssue}
                  value={addIssue}
                  disabled={readOnly}
                />
                <IconButton
                  onClick={() => addNewIssue()}
                  style={{ marginTop: 6 }}
                  disabled={readOnly}
                >
                  <AddCircleOutlineIcon />
                </IconButton>
              </Box>
              <List>
                {report.issues.map((issue, index) => (
                  <ListItem
                    key={'issue' + index}
                    button
                    id={'issue' + index}
                    style={{
                      textDecoration: issue.resolved ? 'line-through' : 'none'
                    }}
                    onClick={() => issueResolved(index)}
                    divider
                  >
                    <ListItemText primary={`${issue.description}`} />
                    <ListItemSecondaryAction>
                      <IconButton
                        onClick={() => removeIssue(index)}
                        edge='end'
                        disabled={readOnly}
                      >
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Box>
          <Grid item xs={12}>
            <IconButton
              onClick={handleIssuesOpen}
              style={{ marginTop: 6 }}
              disabled={readOnly}
              color='secondary'
            >
              <FormatListNumberedIcon />
              &nbsp;Email To-Do List
            </IconButton>
            <List>
              {sentEmails.map(sent =>
                sent.action === 'ToDo' ? (
                  <ListItem key={sent._id}>
                    <ListItemText>
                      <IconButton
                        onClick={() => displayEmailSent(sent)}
                        style={{ marginTop: 6 }}
                        color='secondary'
                      >
                        <EmailIcon />
                        &nbsp;
                        {moment(sent.sent)
                          .tz('America/Los_Angeles')
                          .format(dateDisplay)}
                      </IconButton>
                    </ListItemText>
                  </ListItem>
                ) : (
                  ''
                )
              )}
            </List>
          </Grid>
        </Grid>
        {report.fieldService ? (
          <Grid
            container
            spacing={2}
            justify='space-between'
            className={classes.formGroup}
          >
            <Box width={1}>
              <Grid item xs={12}>
                <Typography style={{ margin: 6 }}>TSheets</Typography>
              </Grid>
              <Grid>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <List dense={true}>
                    {(report.tsheets||[]).map((tsheet, index) => (
                      <ListItem
                        key={'tsheet' + index}
                        style={{ marginTop: -40 }}
                      >
                        <ListItemText>
                          <Grid
                            container
                            direction='row'
                            spacing={2}
                            justify='space-between'
                            className={classes.formGroup}
                          >
                            <Grid item>
                              <DatePicker
                                variant='outlined'
                                format='MM/dd/yyyy'
                                label='Date'
                                value={tsheet.date}
                                disabled={true}
                              />
                            </Grid>
                            <Grid item>
                              <TimePicker
                                label='Start'
                                value={tsheet.start}
                                disabled={true}
                              />
                            </Grid>
                            <Grid item>
                              <TimePicker
                                label='End'
                                value={tsheet.end}
                                disabled={true}
                              />
                            </Grid>
                            <Grid item>
                              <TextField
                                label='Duration'
                                type='string'
                                value={new Date(1000 * tsheet.duration)
                                  .toISOString()
                                  .substr(11, 5)}
                                disabled={true}
                              />
                            </Grid>
                            <Grid item>
                              <TextField
                                label='Name'
                                type='string'
                                value={tsheet.name}
                                disabled={true}
                              />
                            </Grid>
                            <Grid item>
                              <TextField
                                label='Notes'
                                type='string'
                                value={tsheet.notes}
                                disabled={true}
                              />
                            </Grid>
                          </Grid>
                        </ListItemText>
                      </ListItem>
                    ))}
                  </List>
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item xs={12}>
                <Typography style={{ margin: 6 }}>
                  Total Time:&nbsp;
                  {new Date(1000 * (report.tsheets||[]).sum('duration'))
                    .toISOString()
                    .substr(11, 5)}
                  &nbsp;(Final time may change when final time sheet has been
                  submitted.)
                </Typography>
              </Grid>
            </Box>
          </Grid>
        ) : (
          ''
        )}

        <Grid
          container
          spacing={2}
          justify='space-between'
          className={classes.formGroup}
        >
          <Box width={1}>
            <Grid item xs={12}>
              <Typography style={{ margin: 6 }}>
                Photos
                <IconButton
                  onClick={() => setOpenWebcam(true)}
                  edge='end'
                  disabled={readOnly}
                >
                  <AddCircleOutlineIcon />
                </IconButton>
              </Typography>
              {report.photos ? (
                <div className={classes.root}>
                  <GridList
                    spacing={3}
                    className={classes.gridList}
                    cols={1.2}
                    cellHeight={533}
                  >
                    {report.photos.map((photo, index) => (
                      <GridListTile
                        key={index}
                        style={{ maxWidth: 320, maxHeight: 533 }}
                      >
                        <img src={photo} />
                        <GridListTileBar
                          titlePosition='top'
                          actionIcon={
                            <IconButton
                              className={classes.icon}
                              onClick={() => removePhoto(index)}
                            >
                              <RemoveCircleOutlineIcon />
                            </IconButton>
                          }
                          actionPosition='left'
                          className={classes.titleBar}
                        />
                      </GridListTile>
                    ))}
                  </GridList>
                </div>
              ) : (
                ''
              )}
            </Grid>
          </Box>
        </Grid>

        <Grid
          container
          direction='row'
          spacing={2}
          justify='space-between'
          className={classes.formGroup}
        >
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  className={classes.checkbox}
                  checked={report.completed}
                  onChange={changeCheckbox}
                  name='completed'
                  color='primary'
                  disabled={readOnly}
                />
              }
              label='Job Completed'
            />
          </Grid>
          <Grid item>
            <TextField
              className={classes.textField}
              helperText={
                report.servicemanSignatureDate
                  ? report.servicemanSignatureDate
                  : ''
              }
              inputProps={{
                style: { fontFamily: 'FFX Handwriting', fontSize: 'xx-large' }
              }}
              name='servicemanSignature'
              label='Serviceman Signature'
              defaultValue={
                report.servicemanSignature ? report.servicemanSignature : ''
              }
              onChange={changeFieldServicemanSignature}
              onBlur={blurField}
              disabled={readOnly}
            />
          </Grid>
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  className={classes.checkbox}
                  checked={report.satisfaction}
                  onChange={changeCheckbox}
                  name='satisfaction'
                  color='primary'
                  disabled={readOnly}
                />
              }
              label='Has the job been completed to your satisfaction?'
            />
            <br />
            <IconButton
              onClick={handlePdfOpen}
              style={{ marginTop: 6 }}
              disabled={readOnly}
              color='secondary'
            >
              <PictureAsPdfIcon />
              &nbsp;Email Report
            </IconButton>
          </Grid>
          <Grid item>
            <TextField
              className={classes.textField}
              helperText={
                report.customerSignatureDate ? report.customerSignatureDate : ''
              }
              inputProps={{
                style: { fontFamily: 'FFX Handwriting', fontSize: 'xx-large' }
              }}
              name='customerSignature'
              label='Customer Signature'
              defaultValue={
                report.customerSignature ? report.customerSignature : ''
              }
              onChange={changeFieldCustomerSignature}
              onBlur={blurField}
              disabled={readOnly}
            />
          </Grid>
          <Grid item xs={12}>
            <List>
              {sentEmails.map(sent =>
                sent.action === 'PDF' ? (
                  <ListItem key={sent._id}>
                    <ListItemText>
                      <IconButton
                        onClick={() => displayEmailSent(sent)}
                        style={{ marginTop: 6 }}
                        color='secondary'
                      >
                        <EmailIcon />
                        &nbsp;
                        {moment(sent.sent)
                          .tz('America/Los_Angeles')
                          .format(dateDisplay)}
                      </IconButton>
                    </ListItemText>
                  </ListItem>
                ) : (
                  ''
                )
              )}
            </List>
          </Grid>
        </Grid>
        <Modal
          open={openWebcam}
          onClose={handleCloseWebcam}
          className={classes.modal}
        >
          <div style={{ position: 'relative' }}>
            <Webcam
              audio={false}
              screenshotFormat='image/jpeg'
              ref={setRef}
              width={320}
              height={533}
              videoConstraints={{
                width: 320,
                height: 533,
                //facingMode: 'user'
                facingMode: { exact: 'environment' }
              }}
            />
            <IconButton
              style={{ marginTop: 6 }}
              variant='contained'
              color='secondary'
              className={classes.modalButton}
              onClick={capture}
            >
              <PhotoCameraIcon />
            </IconButton>
          </div>
        </Modal>
      </div>
      <Dialog open={openEmail} onClose={handleEmailClose}>
        <DialogTitle>
          {'Email' +
            (email.sent
              ? ' sent on ' +
                moment(email.sent)
                  .tz('America/Los_Angeles')
                  .format(dateDisplay)
              : '')}
        </DialogTitle>
        <Grid style={{ margin: 20 }}>
          <TextField
            style={{ marginBottom: 10 }}
            className={classes.textFieldWide}
            variant='outlined'
            name='to'
            label='To:'
            defaultValue={email.to}
            disabled={email.readOnly ? true : false}
            onChange={changeEmail}
          />
          <TextField
            className={classes.textFieldWide}
            style={{ marginBottom: 10 }}
            multiline={true}
            variant='outlined'
            name='subject'
            label='Subject'
            defaultValue={email.subject}
            disabled={email.readOnly ? true : false}
            onChange={changeEmail}
          />
          <TextField
            className={classes.textFieldWide}
            multiline={true}
            variant='outlined'
            name='body'
            label='Body'
            defaultValue={email.body}
            disabled={email.readOnly ? true : false}
            onChange={changeEmail}
          />
        </Grid>

        <DialogActions>
          <Button onClick={handleEmailClose} color='primary'>
            {email.readOnly ? 'Close' : 'Cancel'}
          </Button>
          {email.readOnly ? (
            ''
          ) : (
            <IconButton onClick={sendEmail} color='secondary' autoFocus>
              <SendIcon /> Send
            </IconButton>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export async function getServerSideProps (context) {
  const { id } = context.params

  const propsReport = await axiosClient
    .get('/reports/' + id)
    .then(response => response.data)

  const propsSent = await axiosClient
    .get('/sent/' + id)
    .then(response => response.data)

  const items = await axiosClient.get('/items').then(response => response.data)

  const propsOptions = items.map(item => {
    const option = {
      type: item.Type,
      value: item.Item,
      label: '[' + item.Item + '] ' + item.Description
    }
    return option
  })

  return {
    props: {
      propsReport,
      propsSent,
      propsOptions
    }
  }
}

export default connect(state => state)(Report)
