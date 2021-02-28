import { AuthProvider } from '@redwoodjs/auth'
import GoTrue from 'gotrue-js'

import ReactDOM from 'react-dom'
import { FatalErrorBoundary } from '@redwoodjs/web'
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'
import FatalErrorPage from 'src/pages/FatalErrorPage'
import ReactGA from 'react-ga'

ReactGA.initialize(process.env.GOOGLE_ANALYTICS_ID)

import Routes from 'src/Routes'

import './scaffold.css'
import './index.css'

const goTrueClient = new GoTrue({
  APIUrl: 'https://cadhub.xyz/.netlify/identity',
  setCookie: true,
})

ReactDOM.render(
  <FatalErrorBoundary page={FatalErrorPage}>
    <AuthProvider client={goTrueClient} type="goTrue">
      <RedwoodApolloProvider>
        <Routes />
      </RedwoodApolloProvider>
    </AuthProvider>
  </FatalErrorBoundary>,
  document.getElementById('redwood-app')
)
