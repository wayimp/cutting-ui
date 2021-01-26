import React from 'react'
import { connect } from 'react-redux'
import { useSnackbar } from 'notistack'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import { red } from '@material-ui/core/colors'
import Avatar from '@material-ui/core/Avatar'
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Tooltip from '@material-ui/core/Tooltip'
import Paper from '@material-ui/core/Paper'
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
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf'
import { baseURL } from '../src/axiosClient'

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

  const foreground =
    typeof report.fieldService === 'undefined'
      ? 'primary'
      : report.fieldService
      ? 'primary'
      : 'secondary'

  return (
    <Card className={classes.root}>
      <CardHeader
        action={
          <>
            <Tooltip title='Archive Report'>
              <IconButton onClick={() => archive(report)}>
                <DeleteIcon color={foreground} />
              </IconButton>
            </Tooltip>
            <Tooltip title='Copy Customer Details to New Report'>
              <IconButton onClick={() => copyToNew(report)}>
                <FileCopyIcon color={foreground} />
              </IconButton>
            </Tooltip>
            <Tooltip title='Display as PDF'>
              <IconButton>
                <Link
                  href={`${baseURL}/pdf/${report._id}`}
                  target={'pdf' + report._id}
                >
                  <PictureAsPdfIcon color={foreground} />
                </Link>
              </IconButton>
            </Tooltip>
            <Tooltip title='View or Edit Report'>
              <IconButton>
                <Link href={`/report/${report._id}`} target={report._id}>
                  <LaunchIcon color={foreground} />
                </Link>
              </IconButton>
            </Tooltip>
          </>
        }
      />
      <CardContent>
        <Typography variant='h5'>{report.customerName}</Typography>
        <Typography variant='body1'>{report.reportedTrouble}</Typography>
        <Typography variant='h5'>
          {report.customerSignatureDate
            ? `Closed: ${report.customerSignatureDate}`
            : ''}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default connect(state => state)(ReportCard)
