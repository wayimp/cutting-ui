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
import ReportItems from '../../components/ReportItems'
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker
} from '@material-ui/pickers'
import Select from 'react-select'

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
  }
}))

const itemsAvailable = [
  {
    quantity: 1,
    itemNo: '1',
    itemName: 'one'
  },
  {
    quantity: 1,
    itemNo: '2',
    itemName: 'two'
  },
  {
    quantity: 1,
    itemNo: '3',
    itemName: 'three'
  }
]

const Report = ({ propsReport, propsOptions, dispatch, token }) => {
  const classes = useStyles()
  const theme = useTheme()
  const [report, setReport] = React.useState(propsReport)
  const [reportEdit, setReportEdit] = useState({})
  const { enqueueSnackbar } = useSnackbar()
  const [selectedDate, setSelectedDate] = React.useState(new Date())

  /*
  //Do we really need a modal here?
  const [openItems, setOpenItems] = React.useState(false)

  const handleOpenItems = () => {
    setOpenItems(true)
  }

  const handleCloseItems = () => {
    setOpenItems(false)
  }

  const handleEditItems = () => {
    const edit = JSON.parse(JSON.stringify(report))
    setReportEdit(edit)
    setOpenItems(true)
  }

  const handleSaveItems = async options => {
    const materials = options.map(option => {
      const material = {
        quantity: option.quantity,
        type: option.type,
        item: option.value,
        description: option.label
      }
      return material
    })
    const updated = {
      ...report,
      materials
    }
    setReport(updated)
    updateReport(updated)
    handleCloseItems()
  }
  */

  const onUnload = () => {
    updateReport(report)
  }

  useEffect(() => {
    document.title = report.customerName
    window.addEventListener('unload', onUnload)
    return () => {
      window.removeEventListener('unload', onUnload)
    }
  })

  const changeValue = (name, value) => {
    const updated = {
      ...report,
      [name]: value
    }
    setReport(updated)
  }

  const changeField = event => {
    changeValue(event.target.name, event.target.value)
  }

  const blurField = event => {
    updateReport(report)
  }

  const changeCheckbox = event => {
    const updated = {
      ...report,
      [event.target.name]: event.target.checked
    }
    setReport(updated)
    updateReport(updated)
  }

  const handleDateChange = date => {
    setSelectedDate(date)
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

  const selectMaterialOption = option => {
    // Translate this from an option to a material
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
          xs={12}
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
              defaultValue={report.job ? report.job : ''}
              onChange={changeField}
              onBlur={blurField}
            />
          </Grid>
          <Grid item>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                variant='inline'
                format='MM/dd/yyyy'
                id='date'
                label='Date'
                value={selectedDate}
                onChange={handleDateChange}
                onBlur={blurField}
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
            />
          </Grid>
        </Grid>

        <Grid
          container
          direction='row'
          xs={12}
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
            />
          </Grid>
        </Grid>
        <Grid
          container
          direction='row'
          xs={12}
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
            />
          </Grid>
        </Grid>

        <Grid
          container
          direction='row'
          xs={12}
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
              />
            </Grid>
          </Box>
        </Grid>
        <Grid
          container
          direction='row'
          xs={12}
          spacing={2}
          justify='space-between'
          className={classes.formGroup}
        >
          <Box width={1}>
            <Grid item>
              {/*
              <Button
                onClick={handleEditItems}
                variant='contained'
                color='secondary'
                className={classes.button}
                startIcon={<FormatListBulletedIcon />}
              >
                Materials Used
              </Button>
              */}
              <Typography style={{ margin: 6 }}>Materials Used</Typography>
              <Select
                className='itemsSelect'
                classNamePrefix='select'
                isClearable={true}
                isSearchable={true}
                onChange={selectMaterialOption}
                name='items'
                options={propsOptions}
              />
              <List dense={true}>
                {report.materials.map((material, index) => (
                  <ListItem>
                    <ListItemAvatar>{material.quantity}</ListItemAvatar>
                    <ListItemText
                      edge='begin'
                      primary={`${material.item}`}
                      secondary={`${material.description}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        onClick={() => addMaterial(index)}
                        edge='begin'
                      >
                        <AddCircleOutlineIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => removeMaterial(index)}
                        edge='end'
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
        {/*
        <ReportItems
          handleSaveItems={handleSaveItems}
          handleCloseItems={handleCloseItems}
          openItems={openItems}
          itemOptions={propsOptions}
        />
       
Not sure if I even want save cancel buttons.
            <Grid
              container
              direction='row'
              justify='flex-end'
              alignItems='flex-end'
            >
              <Button
                variant='contained'
                color='secondary'
                style={{ margin: 10 }}
                onClick={handleCloseItems}
                startIcon={<CancelIcon />}
              >
                Cancel
              </Button>
              <Button
                variant='contained'
                color='primary'
                style={{ margin: 10 }}
                onClick={() => updateReport(report)}
                startIcon={<SaveIcon />}
              >
                Save
              </Button>
            </Grid>
*/}

        {/*

  "materials": [
    {
      "quantity": 1,
      "itemNo": "1",
      "itemName": "test"
    }
  ],
  "servicePerformed": "",
  "issues": [
    {
      "description": "test",
      "resolved": false
    }
  ],
  "logs": [
    {
      "date": "",
      "on": "",
      "off": "",
      "mileage": 10,
      "hours": 3.2,
      "lodging": false,
      "toll": false
    }
  ],
  "completed": true,
  "satifaction": true,
  "customerSignature": "",
  "customerSignatureDate": "",
  "servicemanSignature": "",
  "servicemanSignatureDate": ""

        <Grid item container xs={12} spacing={2} justify='flex-end'>
          <Grid item>
            <Timeline>
              {report.timeline.map((timestamp, index) => (
                <TimelineItem key={index}>
                  <TimelineSeparator>
                    <TimelineDot />
                    {index < report.timeline.length - 1 ? (
                      <TimelineConnector />
                    ) : (
                      ''
                    )}
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography>
                      {timestamp[`description_${langSuffix}`]}<p/>
                      {moment(timestamp.timestamp, dateFormat)
                        .locale(lang.substring(0, 2))
                        .format(dateDisplay)}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </Grid>
          {report.timeline.length <= 1 ? (
            <Grid item>
              <Button
                onClick={reportDelivered}
                variant='contained'
                color='primary'
                className={classes.button}
                startIcon={<CheckCircleIcon />}
              >
                {getLangString('report.delivered', lang)}
              </Button>
              <Button
                onClick={reportCancelled}
                variant='contained'
                color='secondary'
                className={classes.button}
                startIcon={<CancelIcon />}
              >
                {getLangString('report.cancelled', lang)}
              </Button>
            </Grid>
          ) : (
            ''
          )}
        </Grid>
        */}
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
      label: item.Description
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
