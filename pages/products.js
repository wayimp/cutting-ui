import React, { useState, useEffect } from 'react'
import VendorDisplay from '../components/VendorDisplay'
import Router from 'next/router'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { wrapper } from '../components/store'
import { fade, makeStyles, useTheme } from '@material-ui/core/styles'
import { getLangString } from '../components/Lang'
import Link from '../src/Link'
import TopBar from '../components/TopBar'
import AddLocationIcon from '@material-ui/icons/AddLocation'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import SendIcon from '@material-ui/icons/Send'
import numeral from 'numeral'
const priceFormat = '$0.00'
import OrderCard from '../components/OrderCard'
import { flatten } from 'lodash'
import moment from 'moment'
const dateFormat = 'YYYY-MM-DDTHH:mm:SS'
const dateDisplay = 'dddd MMMM DD'
import { useSnackbar } from 'notistack'
import cookie from 'js-cookie'
import axiosClient from '../src/axiosClient'
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

const useStyles = makeStyles(theme => ({
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    // padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar
  },
  center: {
    textAlign: 'center'
  },
  root: {
    flexGrow: 1
  },
  content: {
    textAlign: 'center',
    flexGrow: 1,
    padding: theme.spacing(7)
  },
  center: {
    textAlign: 'center',
    flexGrow: 1
  },
  margin: {
    margin: theme.spacing(1)
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
  day: {
    backgroundColor: '#EEF',
    border: '1px solid #AAA',
    margin: '5px',
    padding: '8px'
  },
  vendorLogo: {
    maxWidth: 250,
    maxHeight: 250,
    float: 'top',
    padding: 10
  }
}))

const Page = ({ dispatch, lang, token, bvendors }) => {
  const classes = useStyles()
  const theme = useTheme()
  const langSuffix = lang ? lang.substring(0, 2) : 'en'
  const [bproducts, setBproducts] = React.useState([])
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (token && token.length > 0) {
      dispatch({ type: 'SEGMENT', payload: 'products' })
    } else {
      Router.push('/')
    }
  }, [token])

  const bvendorsMine = bvendors.filter(bvendor => bvendor.isMine)

  return (
    <Container>
      <TopBar />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <div className={classes.root}>
          {bvendorsMine.map(bvendor => (
            <VendorDisplay
              key={bvendor._id}
              bvendor={bvendor}
            />
          ))}
        </div>
      </main>
    </Container>
  )
}

export default connect(state => state)(Page)
