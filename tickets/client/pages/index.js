import * as React from 'react'
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
  return {}
}

HomePage.propTypes = {
  currentUser: PropTypes.object
}

export default HomePage
