import { AuthProvider } from '@redwoodjs/auth'
import GoTrue from 'gotrue-js'

import { RedwoodProvider } from '@redwoodjs/web'
import FatalErrorBoundary from 'src/components/FatalErrorBoundary/FatalErrorBoundary'
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'
import FatalErrorPage from 'src/pages/FatalErrorPage'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
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

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      light: '#C99DFF',
      main: '#A663FA',
      dark: '#3B0480',
    },
  },
})

const App = () => (
  <FatalErrorBoundary page={FatalErrorPage}>
    <RedwoodProvider>
      <AuthProvider client={goTrueClient} type="goTrue">
        <RedwoodApolloProvider>
          <ThemeProvider theme={theme}>
            <Routes />
          </ThemeProvider>
        </RedwoodApolloProvider>
      </AuthProvider>
    </RedwoodProvider>
  </FatalErrorBoundary>
)

export default App
