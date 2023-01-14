import buildClient from '../api/buildClient'

const HomePage = ({ currentUser }) => {
  return (
  <>
    <h1>Boom</h1>
    {currentUser && <p>You're signed in</p>}
  </>
  )
}

HomePage.getInitialProps = async (context) => {
  const client = buildClient(context)
  const { data } = await client.get('/api/users/currentuser')

  return data
}

export default HomePage
