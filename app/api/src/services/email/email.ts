import { requireAuth } from 'src/lib/auth'
import {sendMail} from 'src/lib/sendmail'
import {users} from 'src/services/users/users'

export const sendAllUsersEmail = async ({input: {body, subject}}) => {
  requireAuth({ role: 'admin' })
  const recipients = (await users()).map(({email}) => email)
  const from = {
    address:'news@mail.cadhub.xyz',
    name: 'CadHub',
  }
  return sendMail({
    to: recipients,
    from,
    subject,
    text: body,
  })
}
