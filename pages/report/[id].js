import React, { useState, useEffect } from 'react'
import axiosClient from '../../src/axiosClient'
import { useSnackbar } from 'notistack'
import { connect } from 'react-redux'
import { flatten } from 'lodash'
import { fade, makeStyles, useTheme } from '@material-ui/core/styles'
import Link from '../../src/Link'
import TopBar from '../../components/TopBar'
import numeral from 'numeral'
const priceFormat = '$0.00'
import moment from 'moment-timezone'
const dateFormat = 'YYYY-MM-DDTHH:mm:SS'
const dateDisplay = 'dddd MMM DD hh:mm a'
import {
  Box,
  Container,
  Grid,
  Checkbox,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Button,
  FormControlLabel,
  IconButton
} from '@material-ui/core'
/*
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@material-ui/lab'
*/
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted'
import CancelIcon from '@material-ui/icons/Cancel'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline'
import DateFnsUtils from '@date-io/date-fns'
import {
  MuiPickersUtilsProvider,
  TimePicker,
  DatePicker
} from '@material-ui/pickers'
import Select from 'react-select'

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
    justifyContent: 'center'
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
  }
}))

const Report = ({ propsReport, propsOptions, dispatch, token }) => {
  const classes = useStyles()
  const theme = useTheme()
  const [report, setReport] = React.useState(propsReport)
  const [readOnly, setReadOnly] = React.useState(true)
  const [reportEdit, setReportEdit] = useState({})
  const { enqueueSnackbar } = useSnackbar()
  const [addIssue, setAddIssue] = React.useState('')
  const [itemNo, setItemNo] = React.useState('')
  const [itemDesc, setItemDesc] = React.useState('')

  const onUnload = () => {
    updateReport(report)
  }

  useEffect(() => {
    document.title = report.customerName

    if (report.customerSignatureDate) {
      setReadOnly(true)
    } else {
      setReadOnly(false)
    }

    window.addEventListener('unload', onUnload)
    return () => {
      window.removeEventListener('unload', onUnload)
    }
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

    // Beware race condition when updating two fields at once
    switch (fieldName) {
      case 'customerSignature':
        setTimeout(
          () =>
            changeValue('customerSignatureDate', moment().format('MM/DD/YYYY')),
          3000
        )
        break

      case 'servicemanSignature':
        setTimeout(
          () =>
            changeValue(
              'servicemanSignatureDate',
              moment().format('MM/DD/YYYY')
            ),
          3000
        )
        break
    }
    changeValue(fieldName, fieldValue)
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

  const selectMaterialOption = option => {
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
      materials: [material].concat(report.materials)
    }
    setReport(updated)
    updateReport(updated)
  }

  const addNewMaterial = () => {
    if (itemNo || itemDesc) {
      const material = {
        quantity: 1,
        item: itemNo,
        description: itemDesc
      }
      const updated = {
        ...report,
        materials: [material].concat(report.materials)
      }
      setItemNo('')
      setItemDesc('')
      setReport(updated)
      updateReport(updated)
    }
  }

  const addMaterial = index => {
    const updated = {
      ...report,
      materials: report.materials.map((material, i) => {
        if (i === index) material.quantity += 1
        return material
      })
    }
    setReport(updated)
    updateReport(updated)
  }

  const removeMaterial = index => {
    const updated = {
      ...report,
      materials: report.materials
        .map((material, i) => {
          if (i === index) material.quantity -= 1
          if (material.quantity < 1) return null
          else return material
        })
        .filter(notNull => notNull)
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

  const addLogEntry = () => {
    const date = moment().tz('America/Los_Angeles')
    const remainder = 5 - (date.minute() % 5)
    const dateTime = moment(date).add(remainder, 'minutes')
    const logEntry = {
      logDate: dateTime,
      timeOn: dateTime,
      timeOff: dateTime,
      mileage: 0.0,
      hours: 0.0,
      lodging: false,
      toll: false
    }
    const updated = {
      ...report,
      logs: report.logs.concat(logEntry)
    }
    setReport(updated)
    updateReport(updated)
  }

  const removeLogEntry = index => {
    const updated = {
      ...report,
      logs: report.logs
        .map((log, i) => {
          if (i === index) return null
          else return log
        })
        .filter(notNull => notNull)
    }
    setReport(updated)
    updateReport(updated)
  }

  const changeLogMileage = (index, text) => {
    const mileage = Number(text)
    const updated = {
      ...report,
      logs: report.logs.map((log, i) => {
        if (i === index) return { ...log, mileage }
        else return log
      })
    }
    setReport(updated)
  }

  const changeLogLodging = index => {
    const updated = {
      ...report,
      logs: report.logs.map((log, i) => {
        if (i === index) return { ...log, lodging: !log.lodging }
        else return log
      })
    }
    setReport(updated)
    updateReport(updated)
  }

  const changeLogToll = index => {
    const updated = {
      ...report,
      logs: report.logs.map((log, i) => {
        if (i === index) return { ...log, toll: !log.toll }
        else return log
      })
    }
    setReport(updated)
    updateReport(updated)
  }

  const handleLogDateChange = (index, date) => {
    const logDate = moment(date).startOf('day')
    const updated = {
      ...report,
      logs: report.logs.map((log, i) => {
        if (i === index) return { ...log, logDate }
        else return log
      })
    }
    setReport(updated)
    updateReport(updated)
  }

  const handleLogTimeOnChange = (index, date) => {
    const timeOn = moment(report.logs[index].logDate)
    const newTime = moment(date)
    timeOn.hour(newTime.get('hour'))
    timeOn.minute(newTime.get('minute'))
    let hours = 0
    if (report.logs[index].timeOff) {
      const timeOff = moment(report.logs[index].timeOff)
      timeOff.year(timeOn.year())
      timeOff.month(timeOn.month())
      timeOff.date(timeOn.date())
      if (timeOff.isAfter(timeOn)) {
        const duration = moment.duration(timeOff.diff(timeOn))
        hours = Number(duration.asHours()).toFixed(2)
      }
    }

    const updated = {
      ...report,
      logs: report.logs.map((log, i) => {
        if (i === index) return { ...log, timeOn, hours }
        else return log
      })
    }
    setReport(updated)
    updateReport(updated)
  }

  const handleLogTimeOffChange = (index, date) => {
    const timeOff = moment(report.logs[index].logDate)
    const newTime = moment(date)
    timeOff.hour(newTime.get('hour'))
    timeOff.minute(newTime.get('minute'))
    let hours = 0
    if (report.logs[index].timeOn) {
      const timeOn = moment(report.logs[index].timeOn)
      timeOn.year(timeOff.year())
      timeOn.month(timeOff.month())
      timeOn.date(timeOff.date())
      if (timeOff.isAfter(timeOn)) {
        const duration = moment.duration(timeOff.diff(timeOn))
        hours = Number(duration.asHours()).toFixed(2)
      }
    }
    const updated = {
      ...report,
      logs: report.logs.map((log, i) => {
        if (i === index) return { ...log, timeOff, hours }
        else return log
      })
    }
    setReport(updated)
    updateReport(updated)
  }

  const updateReport = async updateReport => {
    await axiosClient
      .patch('/reports', updateReport)
      .then(res => {
        //enqueueSnackbar('Report Updated', {
        //  variant: 'success'
        //})
        setReport(updateReport)
      })
      .catch(err => {
        //enqueueSnackbar('Update Error', {
        //  variant: 'error'
        //})
      })
  }

  return (
    <Container className={classes.root}>
      <TopBar />
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
            <TextField
              className={classes.textField}
              name='job'
              label='Job#'
              disabled={readOnly}
              defaultValue={report.job ? report.job : ''}
              onChange={changeField}
              onBlur={blurField}
            />
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
                value={report.date}
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
          </Grid>
          <Grid item>
            <TextField
              className={classes.textField}
              variant='outlined'
              name='control'
              label='Control'
              defaultValue={report.control ? report.control : ''}
              onChange={changeField}
              onBlur={blurField}
              disabled={readOnly}
            />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <TextField
              className={classes.textField}
              variant='outlined'
              name='controlSerial'
              label='Control Serial'
              defaultValue={report.controlSerial ? report.controlSerial : ''}
              onChange={changeField}
              onBlur={blurField}
              disabled={readOnly}
            />
          </Grid>
          <Grid item>
            <TextField
              className={classes.textField}
              variant='outlined'
              name='plasmaType'
              label='Plasma Type'
              defaultValue={report.plasmaType ? report.plasmaType : ''}
              onChange={changeField}
              onBlur={blurField}
              disabled={readOnly}
            />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <TextField
              className={classes.textField}
              variant='outlined'
              name='plasmaModel'
              label='Plasma Model'
              defaultValue={report.plasmaModel ? report.plasmaModel : ''}
              onChange={changeField}
              onBlur={blurField}
              disabled={readOnly}
            />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <TextField
              className={classes.textField}
              variant='outlined'
              name='plasmaSerial'
              label='Plasma Serial'
              defaultValue={report.plasmaSerial ? report.plasmaSerial : ''}
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

          <Grid item>
            <TextField
              className={classes.textField}
              variant='outlined'
              name='drive'
              label='Drive'
              defaultValue={report.drive ? report.drive : ''}
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
          </Grid>
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
              <Typography style={{ margin: 6 }}>Materials Used</Typography>
              <Select
                styles={selectStyles}
                className='itemsSelect'
                classNamePrefix='select'
                isClearable={true}
                isSearchable={true}
                onChange={selectMaterialOption}
                name='items'
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
                value={itemNo}
                onChange={event => setItemNo(event.target.value)}
                disabled={readOnly}
              />
              &nbsp;&nbsp;&nbsp;&nbsp;
              <TextField
                className={classes.textField}
                variant='outlined'
                name='itemDesc'
                label='Item Description'
                value={itemDesc}
                onChange={event => setItemDesc(event.target.value)}
                disabled={readOnly}
              />
              <IconButton
                style={{ marginTop: 6 }}
                onClick={() => addNewMaterial()}
                disabled={readOnly}
              >
                <AddCircleOutlineIcon />
              </IconButton>
            </Grid>
            <Grid item xs={12}>
              <List>
                {report.materials.map((material, index) => (
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
                          onClick={() => addMaterial(index)}
                          disabled={readOnly}
                        >
                          <AddCircleOutlineIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => removeMaterial(index)}
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
        </Grid>
        <Grid
          container
          spacing={2}
          justify='space-between'
          className={classes.formGroup}
        >
          <Box width={1}>
            <Grid item xs={12}>
              <Typography style={{ margin: 6 }}>
                Log Entries
                <IconButton
                  onClick={() => addLogEntry()}
                  edge='end'
                  disabled={readOnly}
                >
                  <AddCircleOutlineIcon />
                </IconButton>
              </Typography>
            </Grid>
            <Grid>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <List dense={true}>
                  {report.logs.map((log, index) => (
                    <ListItem key={'log' + index}>
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
                              autoOk
                              disableFuture
                              variant='outlined'
                              format='MM/dd/yyyy'
                              label='Date'
                              value={log.logDate}
                              onChange={date =>
                                handleLogDateChange(index, date)
                              }
                              disabled={readOnly}
                            />
                          </Grid>
                          <Grid item>
                            <TimePicker
                              autoOk
                              disableFuture
                              showTodayButton
                              todayLabel='now'
                              minutesStep={5}
                              label='Time On'
                              value={log.timeOn}
                              onChange={date =>
                                handleLogTimeOnChange(index, date)
                              }
                              disabled={readOnly}
                            />
                          </Grid>
                          <Grid item>
                            <TimePicker
                              autoOk
                              disableFuture
                              showTodayButton
                              todayLabel='now'
                              minutesStep={5}
                              label='Time Off'
                              value={log.timeOff}
                              onChange={date =>
                                handleLogTimeOffChange(index, date)
                              }
                              helperText={
                                log.hours ? 'Total hours: ' + log.hours : ''
                              }
                              disabled={readOnly}
                            />
                          </Grid>
                          <Grid item>
                            <TextField
                              label='Mileage'
                              type='number'
                              defaultValue={log.mileage}
                              onChange={event =>
                                changeLogMileage(index, event.target.value)
                              }
                              disabled={readOnly}
                            />
                          </Grid>
                          <Grid item>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  className={classes.checkbox}
                                  checked={log.lodging}
                                  onChange={() => changeLogLodging(index)}
                                  name='lodging'
                                  color='primary'
                                  disabled={readOnly}
                                />
                              }
                              label='Lodging'
                            />
                          </Grid>
                          <Grid item>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  className={classes.checkbox}
                                  checked={log.toll}
                                  onChange={() => changeLogToll(index)}
                                  name='toll'
                                  color='primary'
                                  disabled={readOnly}
                                />
                              }
                              label='Toll'
                            />
                          </Grid>
                        </Grid>
                      </ListItemText>
                      <ListItemSecondaryAction>
                        <IconButton
                          onClick={() => removeLogEntry(index)}
                          edge='end'
                          disabled={readOnly}
                        >
                          <RemoveCircleOutlineIcon />
                        </IconButton>
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
              onChange={changeField}
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
              onChange={changeField}
              onBlur={blurField}
              disabled={readOnly}
            />
          </Grid>
        </Grid>
      </div>
    </Container>
  )
}

export async function getServerSideProps (context) {
  const { id } = context.params

  const propsReport = await axiosClient
    .get('/reports/' + id)
    .then(response => response.data)

  const items = await axiosClient.get('/items').then(response => response.data)

  const propsOptions = items.map(item => {
    const option = {
      type: item.Type,
      value: item.Item,
      label: item.Item + ': ' + item.Description
    }
    return option
  })

  return {
    props: {
      propsReport,
      propsOptions
    }
  }
}

export default connect(state => state)(Report)
