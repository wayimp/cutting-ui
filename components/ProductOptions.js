/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { connect } from 'react-redux'
import Select from 'react-select'
import { getLangString } from './Lang'
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
    padding: theme.spacing(2)
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

const ProductOptions = ({
  handleSaveOptions,
  handleCloseOptions,
  openOptions,
  variantsAvailable,
  updateBproduct,
  lang
}) => {
  const classes = useStyles()
  const langSuffix = lang ? lang.substring(0, 2) : 'en'
  const [variants, setVariants] = useState(
    variantsAvailable ? variantsAvailable : []
  )
  const [selectedVariant, setSelectedVariant] = useState({})
  const [options, setOptions] = useState({})
  const [editIndex, setEditIndex] = useState(-1)

  const getDefaultOptions = index => {
    let defaultOptions = {}
    if (variantsAvailable && variantsAvailable.length > 0) {
      variantsAvailable.map((variantSelect, index) => {
        if (
          variantSelect[`options_${langSuffix}`] &&
          variantSelect[`options_${langSuffix}`].length > 0
        ) {
          defaultOptions = variantSelect[`options_${langSuffix}`].filter(
            option => option.isSelected
          )
        }
      })
    }
    return defaultOptions
  }

  const handleVariantChange = (index, selected) => {
    const updateMe = {}
    Object.assign(updateMe, selectedVariant)
    updateMe[index] = selected
    setSelectedVariant(updateMe)
  }

  const addNewOptions = () => {
    const updateMe = variants && Array.isArray(variants) ? variants.slice() : []
    setVariants(
      updateMe.concat({
        placeholder_en: '',
        placeholder_es: '',
        isMulti: false,
        options_en: [
          {
            value: '',
            label: '',
            price: 0
          }
        ],
        options_es: [
          {
            value: '',
            label: '',
            price: 0
          }
        ]
      })
    )
  }

  const removeOptionGroup = index => {
    if (index === editIndex) {
      setEditIndex(-1)
      setOptions({})
    }
    setVariants(variants.slice(0, index).concat(variants.slice(index + 1)))
  }

  const moveUpOptionGroup = index => {
    if (index > 0) {
      const extracted = variants.slice(index, index + 1)
      const remaining = variants
        .slice(0, index)
        .concat(variants.slice(index + 1))
      const inserted = remaining
        .slice(0, index - 1)
        .concat(extracted)
        .concat(remaining.slice(index - 1))
      setVariants(inserted)
      if (index === editIndex) {
        setEditIndex(editIndex - 1)
      }
      if (index === editIndex + 1) {
        setEditIndex(editIndex + 1)
      }
    }
  }

  const moveDownOptionGroup = index => {
    if (index < variants.length - 1) {
      const extracted = variants.slice(index, index + 1)
      const remaining = variants
        .slice(0, index)
        .concat(variants.slice(index + 1))
      const inserted = remaining
        .slice(0, index + 1)
        .concat(extracted)
        .concat(remaining.slice(index + 1))
      setVariants(inserted)
      if (index === editIndex) {
        setEditIndex(editIndex + 1)
      }
      if (index === editIndex - 1) {
        setEditIndex(editIndex - 1)
      }
    }
  }

  const editOptionGroup = index => {
    setEditIndex(index)
    const editMe = variants.slice(index, index + 1)[0]
    setOptions(editMe)
  }

  const cancelOptions = () => {
    setEditIndex(-1)
    setOptions({})
  }

  const updateOptions = async updateMe => {
    setVariants(
      variants
        .slice(0, editIndex)
        .concat(updateMe)
        .concat(variants.slice(editIndex + 1))
    )
  }

  const updateIsMulti = e => {
    const updateMe = {}
    Object.assign(updateMe, options)
    updateMe.isMulti = e.target.checked
    setOptions(updateMe)
    updateOptions(updateMe)
  }

  const updatePlaceholderEn = e => {
    const updateMe = {}
    Object.assign(updateMe, options)
    updateMe.placeholder_en = e.target.value
    setOptions(updateMe)
    updateOptions(updateMe)
  }

  const updatePlaceholderEs = e => {
    const updateMe = {}
    Object.assign(updateMe, options)
    updateMe.placeholder_es = e.target.value
    setOptions(updateMe)
    updateOptions(updateMe)
  }

  const addOptionEn = () => {
    const updateMe = {}
    Object.assign(updateMe, options)
    updateMe.options_en = (Array.isArray(updateMe.options_en)
      ? updateMe.options_en
      : []
    ).concat({
      isSelected: false,
      value: '',
      label: '',
      price: 0
    })
    setOptions(updateMe)
    updateOptions(updateMe)
  }

  const addOptionEs = () => {
    const updateMe = {}
    Object.assign(updateMe, options)
    updateMe.options_es = (Array.isArray(updateMe.options_es)
      ? updateMe.options_es
      : []
    ).concat({
      isSelected: false,
      value: '',
      label: '',
      price: 0
    })
    setOptions(updateMe)
    updateOptions(updateMe)
  }

  const updateIsSelectedEn = (index, e) => {
    const updateMe = {}
    Object.assign(updateMe, options)
    const updatedOption = {
      ...updateMe.options_en[index],
      isSelected: e.target.checked
    }
    updateMe.options_en = updateMe.options_en
      .slice(0, index)
      .concat(updatedOption)
      .concat(updateMe.options_en.slice(index + 1))
    setOptions(updateMe)
    updateOptions(updateMe)
  }

  const updateIsSelectedEs = (index, e) => {
    const updateMe = {}
    Object.assign(updateMe, options)
    const updatedOption = {
      ...updateMe.options_es[index],
      isSelected: e.target.checked
    }
    updateMe.options_es = updateMe.options_es
      .slice(0, index)
      .concat(updatedOption)
      .concat(updateMe.options_es.slice(index + 1))
    setOptions(updateMe)
    updateOptions(updateMe)
  }

  const updateLabelEn = (index, e) => {
    const updateMe = {}
    Object.assign(updateMe, options)
    const updatedOption = {
      ...updateMe.options_en[index],
      value: e.target.value,
      label: e.target.value
    }
    updateMe.options_en = updateMe.options_en
      .slice(0, index)
      .concat(updatedOption)
      .concat(updateMe.options_en.slice(index + 1))
    setOptions(updateMe)
    updateOptions(updateMe)
  }

  const updateLabelEs = (index, e) => {
    const updateMe = {}
    Object.assign(updateMe, options)
    const updatedOption = {
      ...updateMe.options_es[index],
      value: e.target.value,
      label: e.target.value
    }
    updateMe.options_es = updateMe.options_es
      .slice(0, index)
      .concat(updatedOption)
      .concat(updateMe.options_es.slice(index + 1))
    setOptions(updateMe)
    updateOptions(updateMe)
  }

  const updatePriceEn = (index, e) => {
    const updateMe = {}
    Object.assign(updateMe, options)
    const updatedOption = {
      ...updateMe.options_en[index],
      price: e.target.value
    }
    updateMe.options_en = updateMe.options_en
      .slice(0, index)
      .concat(updatedOption)
      .concat(updateMe.options_en.slice(index + 1))
    setOptions(updateMe)
    updateOptions(updateMe)
  }

  const updatePriceEs = (index, e) => {
    const updateMe = {}
    Object.assign(updateMe, options)
    const updatedOption = {
      ...updateMe.options_es[index],
      price: e.target.value
    }
    updateMe.options_es = updateMe.options_es
      .slice(0, index)
      .concat(updatedOption)
      .concat(updateMe.options_es.slice(index + 1))
    setOptions(updateMe)
    updateOptions(updateMe)
  }

  const moveUpOptionEn = index => {
    if (index > 0) {
      const updateMe = {}
      Object.assign(updateMe, options)
      const extracted = updateMe.options_en.slice(index, index + 1)
      const remaining = updateMe.options_en
        .slice(0, index)
        .concat(updateMe.options_en.slice(index + 1))
      const inserted = remaining
        .slice(0, index - 1)
        .concat(extracted)
        .concat(remaining.slice(index - 1))
      updateMe.options_en = inserted
      setOptions(updateMe)
      updateOptions(updateMe)
    }
  }

  const moveUpOptionEs = index => {
    if (index > 0) {
      const updateMe = {}
      Object.assign(updateMe, options)
      const extracted = updateMe.options_es.slice(index, index + 1)
      const remaining = updateMe.options_es
        .slice(0, index)
        .concat(updateMe.options_es.slice(index + 1))
      const inserted = remaining
        .slice(0, index - 1)
        .concat(extracted)
        .concat(remaining.slice(index - 1))
      updateMe.options_es = inserted
      setOptions(updateMe)
      updateOptions(updateMe)
    }
  }

  const moveDownOptionEn = index => {
    if (index < options.options_en.length - 1) {
      const updateMe = {}
      Object.assign(updateMe, options)
      const extracted = updateMe.options_en.slice(index, index + 1)
      const remaining = updateMe.options_en
        .slice(0, index)
        .concat(updateMe.options_en.slice(index + 1))
      const inserted = remaining
        .slice(0, index + 1)
        .concat(extracted)
        .concat(remaining.slice(index + 1))
      updateMe.options_en = inserted
      setOptions(updateMe)
      updateOptions(updateMe)
    }
  }

  const moveDownOptionEs = index => {
    if (index < options.options_es.length - 1) {
      const updateMe = {}
      Object.assign(updateMe, options)
      const extracted = updateMe.options_es.slice(index, index + 1)
      const remaining = updateMe.options_es
        .slice(0, index)
        .concat(updateMe.options_es.slice(index + 1))
      const inserted = remaining
        .slice(0, index + 1)
        .concat(extracted)
        .concat(remaining.slice(index + 1))
      updateMe.options_es = inserted
      setOptions(updateMe)
      updateOptions(updateMe)
    }
  }

  const removeOptionEn = index => {
    const updateMe = {}
    Object.assign(updateMe, options)
    updateMe.options_en = updateMe.options_en
      .slice(0, index)
      .concat(updateMe.options_en.slice(index + 1))
    setOptions(updateMe)
    updateOptions(updateMe)
  }

  const removeOptionEs = index => {
    const updateMe = {}
    Object.assign(updateMe, options)
    updateMe.options_es = updateMe.options_es
      .slice(0, index)
      .concat(updateMe.options_es.slice(index + 1))
    setOptions(updateMe)
    updateOptions(updateMe)
  }

  return (
    <Modal
      id='options'
      className={classes.modal}
      open={openOptions}
      onClose={handleCloseOptions}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500
      }}
    >
      <Fade in={openOptions}>
        <div className={classes.paper}>
          <Grid container spacing={1} justify='space-between'>
            <Grid container item xs={5}>
              <Grid item xs={12}>
                <Tooltip title={getLangString('options.addNewGroup', lang)}>
                  <IconButton onClick={() => addNewOptions()}>
                    <AddCircleIcon color='secondary' />
                  </IconButton>
                </Tooltip>
              </Grid>

              {variants && Array.isArray(variants) && variants.length > 0
                ? variants.map((variantSelect, index) =>
                    variantSelect[`options_${langSuffix}`] &&
                    variantSelect[`options_${langSuffix}`].length > 0 ? (
                      <Grid
                        key={'optionsGroup' + index}
                        container
                        style={
                          index === editIndex ? { backgroundColor: '#EEF' } : {}
                        }
                      >
                        <Grid item xs={8}>
                          <Select
                            key={'options' + index}
                            placeholder={
                              variantSelect[`placeholder_${langSuffix}`]
                            }
                            isMulti={variantSelect.isMulti}
                            value={
                              selectedVariant[index]
                                ? selectedVariant[index]
                                : getDefaultOptions(index)
                            }
                            onChange={selected =>
                              handleVariantChange(index, selected)
                            }
                            options={variantSelect[`options_${langSuffix}`]}
                          />
                        </Grid>
                        <Grid item xs={4} style={{ padding: 5 }}>
                          <Tooltip title={getLangString('common.delete', lang)}>
                            <IconButton
                              className={classes.iconButton}
                              onClick={() => removeOptionGroup(index)}
                            >
                              <DeleteIcon color='secondary' />
                            </IconButton>
                          </Tooltip>
                          <Tooltip
                            title={getLangString('options.moveUp', lang)}
                          >
                            <IconButton
                              className={classes.iconButton}
                              onClick={() => moveUpOptionGroup(index)}
                            >
                              <ArrowUpwardIcon color='secondary' />
                            </IconButton>
                          </Tooltip>
                          <Tooltip
                            title={getLangString('options.moveDown', lang)}
                          >
                            <IconButton
                              className={classes.iconButton}
                              onClick={() => moveDownOptionGroup(index)}
                            >
                              <ArrowDownwardIcon color='secondary' />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={getLangString('common.edit', lang)}>
                            <IconButton
                              className={classes.iconButton}
                              onClick={() => editOptionGroup(index)}
                            >
                              <EditIcon color='secondary' />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    ) : (
                      ''
                    )
                  )
                : ''}
            </Grid>
            <Grid container item xs={7}>
              {options && options.hasOwnProperty('options_en') ? (
                <>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={options.isMulti}
                          onChange={updateIsMulti}
                          name='isMulti'
                          color='primary'
                        />
                      }
                      label={getLangString('options.isMulti', lang)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl>
                      <TextField
                        className={classes.field}
                        variant='outlined'
                        id='placeholder_en'
                        label={getLangString('options.placeholder', 'enUS')}
                        value={options.placeholder_en}
                        onChange={updatePlaceholderEn}
                      />
                    </FormControl>
                    <Tooltip
                      title={getLangString('options.addOptionEnglish', lang)}
                    >
                      <IconButton onClick={() => addOptionEn()}>
                        <AddCircleIcon color='secondary' />
                      </IconButton>
                    </Tooltip>
                    {Array.isArray(options.options_en)
                      ? options.options_en.map((option, index) => (
                          <Box
                            style={{ marginTop: 10 }}
                            key={'options_en' + index}
                          >
                            <Tooltip
                              title={getLangString(
                                'options.optionSelected',
                                lang
                              )}
                            >
                              <Checkbox
                                checked={option.isSelected}
                                onChange={e => updateIsSelectedEn(index, e)}
                                name='selectedEn'
                                color='primary'
                              />
                            </Tooltip>
                            <FormControl>
                              <TextField
                                className={classes.field}
                                variant='outlined'
                                label={getLangString('options.name', 'enUS')}
                                value={option.label}
                                onChange={e => updateLabelEn(index, e)}
                              />
                            </FormControl>
                            <FormControl>
                              <TextField
                                style={{ maxWidth: 68 }}
                                className={classes.field}
                                variant='outlined'
                                label={getLangString('options.price', 'enUS')}
                                value={option.price}
                                onChange={e => updatePriceEn(index, e)}
                              />
                            </FormControl>
                            <Tooltip
                              title={getLangString('common.delete', lang)}
                            >
                              <IconButton
                                className={classes.iconButton}
                                onClick={() => removeOptionEn(index)}
                              >
                                <DeleteIcon color='secondary' />
                              </IconButton>
                            </Tooltip>
                            <Tooltip
                              title={getLangString('options.moveUp', lang)}
                            >
                              <IconButton
                                className={classes.iconButton}
                                onClick={() => moveUpOptionEn(index)}
                              >
                                <ArrowUpwardIcon color='secondary' />
                              </IconButton>
                            </Tooltip>
                            <Tooltip
                              title={getLangString('options.moveDown', lang)}
                            >
                              <IconButton
                                className={classes.iconButton}
                                onClick={() => moveDownOptionEn(index)}
                              >
                                <ArrowDownwardIcon color='secondary' />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        ))
                      : ''}
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl>
                      <TextField
                        className={classes.field}
                        variant='outlined'
                        id='placeholder_es'
                        label={getLangString('options.placeholder', 'esES')}
                        value={options.placeholder_es}
                        onChange={updatePlaceholderEs}
                      />
                    </FormControl>
                    <Tooltip
                      title={getLangString('options.addOptionSpanish', lang)}
                    >
                      <IconButton onClick={() => addOptionEs()}>
                        <AddCircleIcon color='secondary' />
                      </IconButton>
                    </Tooltip>

                    {Array.isArray(options.options_es)
                      ? options.options_es.map((option, index) => (
                          <Box
                            style={{ marginTop: 10 }}
                            key={'options_es' + index}
                          >
                            <Tooltip
                              title={getLangString(
                                'options.optionSelected',
                                lang
                              )}
                            >
                              <Checkbox
                                checked={option.isSelected}
                                onChange={e => updateIsSelectedEs(index, e)}
                                name='selectedEs'
                                color='primary'
                              />
                            </Tooltip>
                            <FormControl>
                              <TextField
                                className={classes.field}
                                variant='outlined'
                                label={getLangString('options.name', 'esES')}
                                value={option.label}
                                onChange={e => updateLabelEs(index, e)}
                              />
                            </FormControl>
                            <FormControl>
                              <TextField
                                style={{ maxWidth: 68 }}
                                className={classes.field}
                                variant='outlined'
                                label={getLangString('options.price', 'esES')}
                                value={option.price}
                                onChange={e => updatePriceEs(index, e)}
                              />
                            </FormControl>
                            <Tooltip
                              title={getLangString('common.delete', lang)}
                            >
                              <IconButton
                                className={classes.iconButton}
                                onClick={() => removeOptionEs(index)}
                              >
                                <DeleteIcon color='secondary' />
                              </IconButton>
                            </Tooltip>
                            <Tooltip
                              title={getLangString('options.moveUp', lang)}
                            >
                              <IconButton
                                className={classes.iconButton}
                                onClick={() => moveUpOptionEs(index)}
                              >
                                <ArrowUpwardIcon color='secondary' />
                              </IconButton>
                            </Tooltip>
                            <Tooltip
                              title={getLangString('options.moveDown', lang)}
                            >
                              <IconButton
                                className={classes.iconButton}
                                onClick={() => moveDownOptionEs(index)}
                              >
                                <ArrowDownwardIcon color='secondary' />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        ))
                      : ''}
                  </Grid>
                </>
              ) : (
                ''
              )}
            </Grid>
            <Grid
              container
              direction='row'
              justify='flex-end'
              alignItems='flex-start'
            >
              <Button
                variant='contained'
                color='secondary'
                style={{ margin: 20 }}
                onClick={handleCloseOptions}
                startIcon={<CancelIcon />}
              >
                {getLangString('common.cancel', lang)}
              </Button>
              <Button
                variant='contained'
                color='primary'
                style={{ margin: 20 }}
                onClick={() => handleSaveOptions(variants)}
                startIcon={<SaveIcon />}
              >
                {getLangString('common.save', lang)}
              </Button>
            </Grid>
          </Grid>
        </div>
      </Fade>
    </Modal>
  )
}

export default connect(state => state)(ProductOptions)
