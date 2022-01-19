import { createGraphQLHandler } from '@redwoodjs/graphql-server'
import { createSentryApolloPlugin } from 'src/lib/sentry'
import { logger } from 'src/lib/logger'
import "discord.js"

import directives from 'src/directives/**/*.{js,ts}'
import sdls from 'src/graphql/**/*.sdl.{js,ts}'
import services from 'src/services/**/*.{js,ts}'

import { getCurrentUser } from 'src/lib/auth'
import { db } from 'src/lib/db'

export const handler = createGraphQLHandler({
  loggerConfig: { logger, options: {} },
  getCurrentUser,
  directives,
  sdls,
  services,
  plugins: [createSentryApolloPlugin()],

  onException: () => {
    // Disconnect from your database with an unhandled exception.
    db.$disconnect()
  },
})
