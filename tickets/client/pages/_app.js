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
    <Header {...pageProps}/>
    <Component {...pageProps}/>
  </>
  )
}

App.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx)
  const { data } = await client.get('/api/users/currentuser')
  const pageProps = appContext.Component.getInitialProps ? await appContext.Component?.getInitialProps(appContext.ctx) : {}

  return { pageProps, currentUser: data.currentUser }
}

export default App
