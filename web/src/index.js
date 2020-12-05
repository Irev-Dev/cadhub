import { AuthProvider } from '@redwoodjs/auth'
import netlifyIdentity from 'netlify-identity-widget'
import ReactDOM from 'react-dom'
import { RedwoodProvider, FatalErrorBoundary } from '@redwoodjs/web'
import FatalErrorPage from 'src/pages/FatalErrorPage'
import ReactGA from 'react-ga'

ReactGA.initialize(process.env.GOOGLE_ANALYTICS_ID)

import Routes from 'src/Routes'

import './scaffold.css'
import 'golden-layout/src/css/goldenlayout-base.css'
import 'golden-layout/src/css/goldenlayout-dark-theme.css'
import './cascade/css/main.css'
import 'monaco-editor/min/vs/editor/editor.main.css'
import './index.css'

netlifyIdentity.init()

function initCascadeStudio() {
  // if ('serviceWorker' in navigator) {
  //     navigator.serviceWorker.register('service-worker.js').then(function(registration) {
  //         registration.update(); // Always update the registration for the latest assets
  //     }, function() {
  //         console.log('Could not register Cascade Studio for offline use!');
  //     });
  // } else {
  //     console.log('Browser does not support offline access!');
  // }

  // Begins loading the CAD Kernel Web Worker
  if (window.Worker) {
    cascadeStudioWorker = new Worker('/CADWorker/CascadeStudioMainWorker.js')
    // Ping Pong Messages Back and Forth based on their registration in messageHandlers
    // var messageHandlers = {};
    cascadeStudioWorker.onmessage = function (e) {
      if (e.data.type in messageHandlers) {
        let response = messageHandlers[e.data.type](e.data.payload)
        if (response) {
          cascadeStudioWorker.postMessage({
            type: e.data.type,
            payload: response,
          })
        }
      }
    }
  }
}
initCascadeStudio()

ReactDOM.render(
  <FatalErrorBoundary page={FatalErrorPage}>
    <AuthProvider client={netlifyIdentity} type="netlify">
      <RedwoodProvider>
        <Routes />
      </RedwoodProvider>
    </AuthProvider>
  </FatalErrorBoundary>,
  document.getElementById('redwood-app')
)
