import { createUserInsecure } from 'src/services/users/users.js'
import { db } from 'src/lib/db'

export const handler = async (req, _context) => {
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
      user_metadata: { full_name: 'sick_dog' },
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

  let roles = []

  if (eventType === 'signup') {
    roles.push('user')
    // const hi = {
    //   email: 'kurt.hutten@gmail.com',
    //   image: '',
    //   bio: ''
    // }

    const generateUniqueUserName = async (seed, count = 0) => {
      const isUnique = !(await db.user.findOne({
        where: { userName: seed },
      }))
      if(isUnique) {
        return seed
      }
      count += 1
      const newSeed = count === 1 ? `${seed}_${count}` : seed.slice(0,-1) + count
      return generateUniqueUserName(newSeed, count)
    }
    const userNameSeed = email.split('@')[0]
    const userName = await generateUniqueUserName(userNameSeed) // TODO maybe come up with a better default userName?
    const input = {
      email,
      userName,
      name: user.user_metadata && user.user_metadata.full_name,
      id: user.id,
    }
    await createUserInsecure({input})

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
