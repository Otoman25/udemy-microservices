import * as React from 'react'
import PropTypes from 'prop-types'
import 'bootstrap/dist/css/bootstrap.css'
import buildClient from '../api/buildClient'
import Header from '../components/Header/Header'

const App = ({ Component, pageProps, currentUser }) => {
  // Naughty redirect because otherwise cookies from api calls dont get stored
  if (typeof window !== 'undefined') {
    if (window.location.href.startsWith('http:')) {
      window.location = window.location.href.replace('http', 'https')
    }
  }
  return (
  <>
    <Header currentUser={currentUser}/>
    <Component {...pageProps}/>
  </>
  )
}

App.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx)
  const response = await client.get('/api/users/currentuser').catch(err => err).then(response => response)
  const pageProps = appContext.Component.getInitialProps ? await appContext.Component?.getInitialProps(appContext.ctx) : {}

  return { pageProps, currentUser: response?.data?.currentUser }
}

App.propTypes = {
  Component: PropTypes.func,
  pageProps: PropTypes.object,
  currentUser: PropTypes.shape({
    email: PropTypes.string,
    id: PropTypes.string
  })
}

export default App
