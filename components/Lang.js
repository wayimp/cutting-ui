import React, { useState } from 'react'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import langFile from './lang.json'

export function getLangString (chain, lang) {
  let arr = chain.split('.')
  var pointer = langFile

  arr.forEach(item => {
    pointer = pointer[item]
  })

  try {
    return pointer[lang]
  } catch (e) {
    return <span/>
  }
}

const LangSwitcher = ({ dispatch, lang }) => {

  const switchLang = newLang => {
    dispatch({ type: 'LANG', payload: newLang })
  }

  return (
    <Button
      variant='contained'
      onClick={() => {
        lang === 'enUS' ? switchLang('esES') : switchLang('enUS')
      }}
    >
      {lang === 'enUS' ? 'En' : 'Es'}
    </Button>
  )
}

export default connect(state => state)(LangSwitcher)
