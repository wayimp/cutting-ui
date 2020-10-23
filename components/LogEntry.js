import React from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker
} from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import {
  Avatar,
  Box,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Collapse,
  IconButton,
  Container,
  Grid,
  Typography,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@material-ui/core'

import LaunchIcon from '@material-ui/icons/Launch'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import moment from 'moment'
const dateFormat = 'YYYY-MM-DDTHH:mm:SS'
const dateDisplay = 'dddd h:mm a'
import { getLangString } from '../components/Lang'
import numeral from 'numeral'
const priceFormat = '$0.00'

Array.prototype.sum = function (prop) {
  let total = Number(0)
  for (let i = 0, _len = this.length; i < _len; i++) {
    total += Number(this && this[i] && this[i][prop] ? this[i][prop] : 0)
  }
  return total
}

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 345,
    margin: 6
  },
  grid: {
    marginTop: -30,
    paddingBottom: 20
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  }
}))

const ReportCard = ({ report }) => {
  const classes = useStyles()
  const [expanded, setExpanded] = React.useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  return (
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
  )
}

export default connect(state => state)(ReportCard)
