import { requireAuth } from 'src/lib/auth'
import { sendMail } from 'src/lib/sendmail'
import { users } from 'src/services/users/users'

export const sendAllUsersEmail = async ({ input: { body, subject } }) => {
  requireAuth({ role: 'admin' })
  const recipients = (await users()).map(({ email }) => email)
  const from = {
    address: 'news@mail.cadhub.xyz',
    name: 'CadHub',
  }
  const result = await sendMail({
    to: recipients,
    from,
    subject,
    text: body,
  })
  await sendMail({
    to: 'k.hutten@protonmail.ch',
    from,
    subject: `All users email report`,
    text: JSON.stringify(result, null, 2),
  })

  return result
}
