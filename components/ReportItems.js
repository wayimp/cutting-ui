/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import Select from 'react-select'
import { makeStyles } from '@material-ui/core/styles'
import {
  Grid,
  Collapse,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogTitle,
  Button,
  IconButton,
  Typography,
  Modal,
  Backdrop,
  Fade,
  FormControl,
  FormControlLabel,
  TextField,
  Switch,
  Tooltip,
  Box,
  Checkbox
} from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    width: '80%'
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },
  field: {
    margin: 0,
    padding: 0
  },
  iconButton: {
    padding: 0,
    margin: 0
  }
}))

const ReportItems = ({
  handleSaveItems,
  handleCloseItems,
  openItems,
  itemOptions
}) => {
  const classes = useStyles()
  const [itemsSelected, setItemsSelected] = React.useState([])

  const selectItem = item => {
    setItemsSelected([item].concat(itemsSelected))
  }

  return (
    <Modal
      id='items'
      className={classes.modal}
      open={openItems}
      onClose={handleCloseItems}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500
      }}
    >
      <Fade in={openItems}>
        <div className={classes.paper}>
          <Grid container spacing={1} justify='space-between'>
            <Grid item xs={12}>
              <Select
              id='items'
                className='itemsSelect'
                classNamePrefix='select'
                isClearable={true}
                isSearchable={true}
                onChange={selectItem}
                name='items'
                options={itemOptions}
              />
            </Grid>

            <Grid item xs={12}>
              {itemsSelected.map(item => item.value)}
            </Grid>

            <Grid
              container
              direction='row'
              justify='flex-end'
              alignItems='flex-end'
            >
              <Button
                variant='contained'
                color='primary'
                style={{ margin: 10 }}
                onClick={handleCloseItems}
                startIcon={<CancelIcon />}
              >
                Cancel
              </Button>
              <Button
                variant='contained'
                color='secondary'
                style={{ margin: 10 }}
                onClick={() => handleSaveItems(itemsSelected)}
                startIcon={<SaveIcon />}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </div>
      </Fade>
    </Modal>
  )
}

export default connect(state => state)(ReportItems)
