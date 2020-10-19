import { createUser } from 'src/services/users/users.js'

export const handler = async (req, _context) => {
  const body = JSON.parse(req.body)
  console.log(body)
  console.log(_context)

  const eventType = body.event
  const user = body.user
  const email = user.email

  let roles = []

  if (eventType === 'signup') {
    roles.push('user')
    const hi = {
      email: 'kurt.hutten@gmail.com',
      image: '',
      bio: ''
    }
    const input = {
      email,
    }
    createUser({input})

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
