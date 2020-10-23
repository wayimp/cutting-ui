import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { enUS } from '@material-ui/core/locale'
import { esES } from '@material-ui/core/locale'
import CssBaseline from '@material-ui/core/CssBaseline'
import theme from '../src/theme'
import App from 'next/app'
import { wrapper } from '../components/store'
import { SnackbarProvider } from 'notistack'

class cuttingApp extends App {
  getInitialProps = async ({ Component, ctx }) => {
    return {
      pageProps: {
        // Call page-level getInitialProps
        ...(Component.getInitialProps
          ? await Component.getInitialProps(ctx)
          : {}),
        // Some custom thing for all pages
        pathname: ctx.pathname
      }
    }
  }

  render () {
    const { Component, pageProps } = this.props

    return (
      <>
        <Head>
          <title>Valley Cutting Systems</title>
          <meta
            name='viewport'
            content='minimum-scale=1, initial-scale=1, width=device-width'
          />
        </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SnackbarProvider
            maxSnack={3}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center'
            }}
          >
            <Component {...pageProps} />
          </SnackbarProvider>
        </ThemeProvider>
      </>
    )
  }
}

export default wrapper.withRedux(cuttingApp)
