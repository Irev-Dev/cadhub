/* for local development
Install and run smee (point at this function)
```
yarn global add smee-client
smee --url https://smee.io/3zgDJiGO8TW7nvf --path /.netlify/functions/event_handler --port 8910
```
*/

import { createHmac } from 'crypto'
import { App } from '@octokit/app'
import type { Endpoints } from '@octokit/types'
import type { PullRequestEvent } from '@octokit/webhooks-types'

const app = new App({
  privateKey: process.env.GITHUB_APP_PRIVATE_KEY,
  appId: process.env.GITHUB_APP_ID,
  webhooks: {
    secret: process.env.GITHUB_APP_SECRET,
  },
})

const signRequestBody = (secret: string, body: string): string =>
  'sha256=' + createHmac('sha256', secret).update(body, 'utf-8').digest('hex')

const writePullRequestComment = async ({
  event,
  message,
}: {
  event: PullRequestEvent
  message: string
}): Promise<
  Endpoints['POST /repos/{owner}/{repo}/issues/{issue_number}/comments']['response']
> => {
  const octokit = await app.getInstallationOctokit(event.installation.id)
  return octokit.request(
    'POST /repos/{owner}/{repo}/issues/{issue_number}/comments',
    {
      owner: event.repository.owner.login,
      repo: event.repository.name,
      issue_number: event.number,
      body: message,
    }
  )
}

export const handler = async (req: {
  body: string
  headers: {
    'x-hub-signature-256': string
    'x-github-event': string
  }
}) => {
  const theirSignature = req.headers['x-hub-signature-256']
  const ourSignature = signRequestBody(process.env.GITHUB_APP_SECRET, req.body)
  if (theirSignature !== ourSignature) {
    return {
      statusCode: 401,
      body: 'Bad signature',
    }
  }
  const eventType = req.headers['x-github-event']
  if (eventType !== 'pull_request') {
    return { statusCode: 200 }
  }
  const event: PullRequestEvent = JSON.parse(req.body)
  if (['reopened', 'opened'].includes(event.action)) {
    await writePullRequestComment({
      event,
      message: 'Salutations, what a fine PR you have here.',
    })
  }
  return {
    statusCode: 200,
  }
}
