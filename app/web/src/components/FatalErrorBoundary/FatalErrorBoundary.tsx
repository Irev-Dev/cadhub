import { FatalErrorBoundary as FatalErrorBoundaryBase } from '@redwoodjs/web'
import * as Sentry from '@sentry/browser'

class FatalErrorBoundary extends FatalErrorBoundaryBase {
  async componentDidCatch(error, errorInfo) {
    // debug netlify prerender code below
    // const div = document.createElement('div')
    // div.innerHTML = JSON.stringify(error)
    // document.body.append(div)

    /* More debug explanation.
    If there's an error in netlify's prerendering service,
    we don't have access to the log so we have to spin it up locally to check.
    This can be with the following commands
    ```
    $ git clone https://github.com/netlify/prerender.git
    $ cd prerender
    ```
    comment out the lines `server.use(require("./lib/plugins/basicAuth"));` and `server.use(require("./lib/plugins/s3HtmlCache"));` in `server.js`
    then
    ```
    $ npm install
    $ npm start
    ```
    This will spin up the service on port 3000, prerendering can than be tested with
    http://localhost:3000/https://cadhub.xyz
    or
    http://localhost:3000/http://localhost:8910/
    where the second url is the route you want to test.
    However we don't have access to the console since it's run by a separate chrome instance,
    so instead errors are put into the DOM
    */
    Sentry.withScope((scope) => {
      scope.setExtras(errorInfo)
      Sentry.captureException(error)
    })
  }
}
export default FatalErrorBoundary
