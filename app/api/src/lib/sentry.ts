import * as Sentry from '@sentry/node'
import { context, Config, ApolloError } from '@redwoodjs/api'

let sentryInitialized = false
if (process.env.SENTRY_DSN && !sentryInitialized) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.CONTEXT,
    release: process.env.COMMIT_REF,
  })
  sentryInitialized = true
}

async function reportError(error) {
  if (!sentryInitialized) return
  // If you do have authentication set up, we can add
  // some user data to help debug issues
  // if (context.currentUser) {
  //   Sentry.configureScope((scope) => {
  //     scope.setUser({
  //       id: context?.currentUser?.id,
  //       email: context?.currentUser?.email,
  //     })
  //   })
  // }
  if (typeof error === 'string') {
    Sentry.captureMessage(error)
  } else {
    Sentry.captureException(error)
  }
  await Sentry.flush()
}

export const sentryWrapper = (handler) => async (event, lambdaContext) => {
  lambdaContext.callbackWaitsForEmptyEventLoop = false
  try {
    return await new Promise((resolve, reject) => {
      const callback = (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      }
      const resp = handler(event, lambdaContext, callback)
      if (resp?.then) {
        resp.then(resolve, reject)
      }
    })
  } catch (e) {
    // This catches both sync errors & promise
    // rejections, because we 'await' on the handler
    await reportError(e)
    throw e
  }
}

export const createSentryApolloPlugin: Config['plugins'][number] = () => ({
  requestDidStart: () => {
    return {
      didEncounterErrors(ctx) {
        // If we couldn't parse the operation, don't
        // do anything here
        if (!ctx.operation) {
          return
        }

        for (const err of ctx.errors) {
          // Only report internal server errors,
          // all errors extending ApolloError should be user-facing
          if (err instanceof ApolloError) {
            continue
          }

          // Add scoped report details and send to Sentry
          Sentry.withScope((scope) => {
            // Annotate whether failing operation was query/mutation/subscription
            scope.setTag('kind', ctx.operation.operation)

            // Log query and variables as extras (make sure to strip out sensitive data!)
            scope.setExtra('query', ctx.request.query)
            scope.setExtra('variables', ctx.request.variables)

            if (err.path) {
              // We can also add the path as breadcrumb
              scope.addBreadcrumb({
                category: 'query-path',
                message: err.path.join(' > '),
                level: Sentry.Severity.Debug,
              })
            }

            const transactionId =
              ctx.request.http.headers.get('x-transaction-id')
            if (transactionId) {
              scope.setTransaction(transactionId)
            }

            Sentry.captureException(err)
          })
        }
      },
    }
  },
})
