import Head from 'next/head'
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from '../component/theme'
import { Provider } from 'react-redux'
import '../styles/globals.scss'
import Script from 'next/script'

import store from '../app/store'

const pageTitle =
  process.env.NEXT_PUBLIC_DOMAIN === 'production'
    ? 'Pomootskey by EnjoyChallenge'
    : 'PreProd Pomootskey'
const appleTouchIcon =
  process.env.NEXT_PUBLIC_DOMAIN === 'production'
    ? '/apple-touch-icon.png'
    : '/apple-touch-icon-preprod.png'

export default function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, interactive-widget=resizes-content"
        />
        <meta name="description" content="Description" />
        <meta name="keywords" content="Keywords" />
        <title>{pageTitle}</title>

        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" sizes="180x180" href={appleTouchIcon} />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#317EFB" />
      </Head>
      <Script src="/inobounce.js"></Script>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </StyledEngineProvider>
    </Provider>
  )
}
