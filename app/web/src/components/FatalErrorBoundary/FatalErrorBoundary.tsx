import { FatalErrorBoundary as FatalErrorBoundaryBase } from '@redwoodjs/web'
import * as Sentry from '@sentry/browser'

class FatalErrorBoundary extends FatalErrorBoundaryBase {
  componentDidCatch(error, errorInfo) {
    Sentry.withScope((scope) => {
      scope.setExtras(errorInfo)
      Sentry.captureException(error)
    })
  }
}
export default FatalErrorBoundary
