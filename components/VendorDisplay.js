import React, { useState, useEffect } from 'react'
import axiosClient from '../src/axiosClient'
import { connect } from 'react-redux'
import { fade, makeStyles, useTheme } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Link from '../src/Link'
import TopBar from '../components/TopBar'
import ProductDisplay from './ProductDisplay'
import { Grid } from '@material-ui/core'
import {
  Card,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Fab
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import { useSnackbar } from 'notistack'
import { getLangString } from './Lang'

const useStyles = makeStyles(theme => ({
  vendorLogo: {
    maxWidth: 250,
    maxHeight: 250,
    float: 'top',
    padding: 10
  },
  section: {
    backgroundColor: '#EEF',
    border: '1px solid #AAA',
    marginBottom: 10
  },
  fab: {
    // float: 'left',
    margin: theme.spacing(1)
  }
}))

const VendorDisplay = ({ bvendor, lang, token }) => {
  const classes = useStyles()
  const theme = useTheme()
  const [selectedCategories, setSelectedCategories] = useState([])
  const [bproducts, setBproducts] = useState([])
  const { enqueueSnackbar } = useSnackbar()

  const getData = () => {
    axiosClient({
      method: 'get',
      url: '/bproducts/' + bvendor.slug,
      headers: { Authorization: `Bearer ${token}` }
    }).then(response => {
      setBproducts(Array.isArray(response.data) ? response.data : [])
    })
  }

  useEffect(() => {
    getData()
  }, [])

  const categories_en =
    bproducts && Array.isArray(bproducts) && bproducts.length > 0
      ? [...new Set(bproducts.map(product => product.category_en))].filter((notEmpty) => { return notEmpty })
      : []

  const categories_es =
    bproducts && Array.isArray(bproducts) && bproducts.length > 0
      ? [...new Set(bproducts.map(product => product.category_es))].filter((notEmpty) => { return notEmpty })
      : []

  const categories = lang === 'esES' ? categories_es : categories_en

  const handleCategoryChange = index => {
    let updated = selectedCategories.slice()
    if (updated.includes(index)) {
      updated = updated.filter(item => item !== index)
    } else {
      updated = updated.concat(index)
    }
    updated = [...new Set(updated)].sort()
    setSelectedCategories(updated)
  }

  const categoryNames = categories.filter((category, index) =>
    selectedCategories.includes(index)
  )

  const filtered =
    selectedCategories.length > 0
      ? bproducts.filter(bproduct =>
          categoryNames.includes(bproduct[`category_${lang.substring(0, 2)}`])
        )
      : bproducts

  const addNew = async () => {
    const bproductAdd = {
      bvendor: bvendor.slug,
      slug: '',
      price: 0,
      taxRate: 0,
      image: '',
      category_en: '',
      name_en: '',
      description_en: '',
      category_es: '',
      name_es: '',
      description_es: '',
      variantsAvailable: [],
      active: false
    }

    await axiosClient({
      method: 'post',
      url: '/bproducts',
      data: bproductAdd,
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        enqueueSnackbar(getLangString('products.added', lang), {
          variant: 'success'
        })
        getData()
      })
      .catch(error => {
        enqueueSnackbar(getLangString('products.notAdded', lang) + error, {
          variant: 'error'
        })
      })
  }

  return (
    <Card className={classes.section}>
      <Grid container direction='column' justify='center' alignItems='center'>
        <img className={classes.vendorLogo} src={bvendor.logo} />
        <Typography>
          {bvendor[`description_${lang.substring(0, 2)}`]}
        </Typography>
        <Grid container justify='center'>
          <FormGroup row>
            {categories.map((category, index) => (
              <FormControlLabel
                key={index}
                checked={selectedCategories.includes(index)}
                onChange={() => handleCategoryChange(index)}
                control={<Checkbox color='primary' />}
                label={category}
              />
            ))}
          </FormGroup>
        </Grid>
      </Grid>
      <div className={classes.root}>
        <Fab color='secondary' className={classes.fab} onClick={addNew}>
          <AddIcon />
        </Fab>
        <Grid
          container
          direction='row'
          justify='space-between'
          alignItems='stretch'
        >
          {filtered.map(bproduct => {
            return (
              <ProductDisplay
                key={bproduct._id}
                bproduct={bproduct}
                categories_en={categories_en}
                categories_es={categories_es}
                getData={getData}
              />
            )
          })}
        </Grid>
      </div>
    </Card>
  )
}

export default connect(state => state)(VendorDisplay)
