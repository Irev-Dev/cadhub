import { AuthProvider } from '@redwoodjs/auth'
import GoTrue from 'gotrue-js'

import { FatalErrorBoundary, RedwoodProvider } from '@redwoodjs/web'
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'
import FatalErrorPage from 'src/pages/FatalErrorPage'
import ReactGA from 'react-ga'

ReactGA.initialize(process.env.GOOGLE_ANALYTICS_ID)

import Routes from 'src/Routes'

import './font-imports.css'
import './scaffold.css'
import './index.css'

const goTrueClient = new GoTrue({
  APIUrl: 'https://cadhub.xyz/.netlify/identity',
  setCookie: true,
})

const App = () => (
  <FatalErrorBoundary page={FatalErrorPage}>
    <RedwoodProvider>
      <AuthProvider client={goTrueClient} type="goTrue">
        <RedwoodApolloProvider>
          <Routes />
        </RedwoodApolloProvider>
      </AuthProvider>
    </RedwoodProvider>
  </FatalErrorBoundary>
)

export default App
