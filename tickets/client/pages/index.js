import * as React from 'react'
import buildClient from '../api/buildClient'
import PropTypes from 'prop-types'

const HomePage = ({ currentUser }) => {
  return (
  <>
    <h1>Boom</h1>
    {currentUser && <p>You&apos;re signed in</p>}
  </>
  )
}

HomePage.getInitialProps = async (context) => {
  const client = buildClient(context)
  const { data } = await client.get('/api/users/currentuser')

  return data
}

HomePage.propTypes = {
  currentUser: PropTypes.object
}

export default HomePage
