import { createUserInsecure } from 'src/services/users/users'
import { db } from 'src/lib/db'
import { sentryWrapper } from 'src/lib/sentry'
import { enforceAlphaNumeric, generateUniqueString } from 'src/services/helpers'
import 'graphql-tag'
import { sendMail } from 'src/lib/sendmail'

const unWrappedHandler = async (req, _context) => {
  const body = JSON.parse(req.body)
  console.log(body)
  console.log(_context)
  // DUMP FROM THE LOGS ABOVE
  /*
  5:09:30 AM: 2020-10-19T18:09:30.011Z	9da27e24-b6ec-404e-8e7d-25b5d323b67a	INFO	{
    event: 'signup',
    instance_id: '403b7d63-17f9-48f1-a85f-3d6b41c7dad1',
    user: {
      id: '641222ee-3e61-4253-8c11-9f764779bcc5',
      aud: '',
      role: '',
      email: 'k.hutten@protonmail.ch',
      confirmation_sent_at: '2020-10-19T18:09:01Z',
      app_metadata: { provider: 'email' },
      user_metadata: { full_name: 'sick_dog', userName: 'hi bob' },
      created_at: '2020-10-19T18:09:01Z',
      updated_at: '2020-10-19T18:09:01Z'
    }
  }
  5:09:30 AM: 2020-10-19T18:09:30.011Z	9da27e24-b6ec-404e-8e7d-25b5d323b67a	INFO	{
    callbackWaitsForEmptyEventLoop: [Getter/Setter],
    succeed: [Function],
    fail: [Function],
    done: [Function],
    functionVersion: '$LATEST',
    functionName: 'ba7eb4948d1313283ebb91472c689d38444f07ae2f4278da925d3ce7f1d94e3c',
    memoryLimitInMB: '1024',
    logGroupName: '/aws/lambda/ba7eb4948d1313283ebb91472c689d38444f07ae2f4278da925d3ce7f1d94e3c',
    logStreamName: '2020/10/19/[$LATEST]af6ff2c067da44268b4a0c9d1e4ca1ea',
    clientContext: {
      custom: {
        netlify: 'eyJpZGVudGl0eSI6eyJ1cmwiOiJodHRwczovL2FuZ3J5LWRpamtzdHJhLTAzMWExMC5uZXRsaWZ5LmFwcC8ubmV0bGlmeS9pZGVudGl0eSIsInRva2VuIjoiZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmxlSEFpT2pFMk1ETXhNekV3TWprc0luTjFZaUk2SWpBaWZRLk54Q0hmb0I2aDRpc0V6NnpJREhWbThLTU5hcEZrb3g0dTFXS2dTemhzUncifSwic2l0ZV91cmwiOiJodHRwczovL2FuZ3J5LWRpamtzdHJhLTAzMWExMC5uZXRsaWZ5LmFwcCJ9'
      },
      identity: {
        url: 'https://angry-dijkstra-031a10.netlify.app/.netlify/identity',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MDMxMzEwMjksInN1YiI6IjAifQ.NxCHfoB6h4isEz6zIDHVm8KMNapFkox4u1WKgSzhsRw'
      }
    },
    identity: undefined,
    invokedFunctionArn: 'arn:aws:lambda:us-east-1:012533533302:function:ba7eb4948d1313283ebb91472c689d38444f07ae2f4278da925d3ce7f1d94e3c',
    awsRequestId: '9da27e24-b6ec-404e-8e7d-25b5d323b67a',
    getRemainingTimeInMillis: [Function: getRemainingTimeInMillis]
  }
  5:09:30 AM: Duration: 5.78 ms	Memory Usage: 69 MB	Init Duration: 199.35 ms
  */

  const eventType = body.event
  const user = body.user
  const email = user.email

  const roles = []

  if (eventType === 'signup') {
    roles.push('user')
    const isUniqueCallback = async (seed) =>
      db.user.findUnique({
        where: { userName: seed },
      })
    const userNameSeed = enforceAlphaNumeric(user?.user_metadata?.userName)
    const userName = await generateUniqueString(userNameSeed, isUniqueCallback) // TODO maybe come up with a better default userName?
    const name = user?.user_metadata?.full_name
    const input = {
      email,
      userName,
      name,
      id: user.id,
    }
    await createUserInsecure({ input })
    const kurtNotification = sendMail({
      to: 'k.hutten@protonmail.ch',
      from: {
        address: 'news@mail.cadhub.xyz',
        name: 'CadHub',
      },
      subject: `New Cadhub User`,
      text: JSON.stringify(input, null, 2),
    })
    const welcomeMsg = sendMail({
      to: email,
      from: {
        address: 'news@mail.cadhub.xyz',
        name: 'CadHub',
      },
      subject: `${name} - Some things you should know about CadHub`,
      text: `Hi, My name's Kurt.

I started CadHub because I wanted a community hub for people who like CodeCAD as much of I do, you should know that the development of CadHub is very much a community effort as well and if you want get involved the discord is the best place to start https://discord.gg/SD7zFRNjGH.
Long term I hope that CadHub will help push CodeCad as a paradigm forward, as there are clear benefits such as: CI/CD for parts, GIT based workflow and CodeCAD parts are normally much more robust to changes to parametric variables because the author can add logic to accommodate big changes where as GUI-CAD usually relies on blackbox heuristics when and is more brittle. Sorry I'm getting into the weeds, if you want to read more on the paradigm see our blog https://learn.cadhub.xyz/.

One very easy way to help out is to simply add any OpenSCAD or CadQuery models you have to the website, building out the library of parts atm is very important.

Hit me up anytime for questions or concerns.
Cheers,
Kurt.

k.hutten@protonmail.ch
https://twitter.com/IrevDev
irevdev#1888 - discord

`,
    })

    try {
      await Promise.all([kurtNotification, welcomeMsg])
    } catch (e) {
      console.log('Problem sending emails', e)
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ app_metadata: { roles: roles } }),
    }
  } else {
    return {
      statusCode: 200,
    }
  }
}

export const handler = sentryWrapper(unWrappedHandler)
