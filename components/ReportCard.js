import React from 'react'
import { connect } from 'react-redux'
import { useSnackbar } from 'notistack'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import { red } from '@material-ui/core/colors'
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
  Tooltip,
  Paper
} from '@material-ui/core'

import LaunchIcon from '@material-ui/icons/Launch'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import DeleteIcon from '@material-ui/icons/Delete'
import moment from 'moment-timezone'
const dateFormat = 'YYYY-MM-DDTHH:mm:SS'
const dateDisplay = 'dddd h:mm a'
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

const ReportCard = ({ report, copyToNew, archive }) => {
  const classes = useStyles()
  const [expanded, setExpanded] = React.useState(false)
  const { enqueueSnackbar } = useSnackbar()

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  return (
    <Card className={classes.root}>
      <CardHeader
        action={
          <>
            <Tooltip title='Archive Report'>
              <IconButton onClick={() => archive(report)}>
                <DeleteIcon color='secondary' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Copy Customer Details to New Report'>
              <IconButton onClick={() => copyToNew(report)}>
                <FileCopyIcon color='secondary' />
              </IconButton>
            </Tooltip>
            <Tooltip title='View or Edit Report'>
              <IconButton>
                <Link href={`/report/${report._id}`} target={report._id}>
                  <LaunchIcon color='secondary' />
                </Link>
              </IconButton>
            </Tooltip>
          </>
        }
      />
      <CardContent>
        <Typography variant='h5' color='textSecondary'>
          {report.customerName}
        </Typography>
        <Typography variant='p' color='textSecondary'>
          {report.reportedTrouble}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default connect(state => state)(ReportCard)
