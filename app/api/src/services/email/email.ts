import { requireAuth } from 'src/lib/auth'
import { sendMail } from 'src/lib/sendmail'
import type { SendMailArgs } from 'src/lib/sendmail'
import { users } from 'src/services/users/users'

export const sendAllUsersEmail = async ({ input: { body, subject } }) => {
  requireAuth({ role: 'admin' })
  const from = {
    address: 'news@mail.cadhub.xyz',
    name: 'CadHub',
  }
  const emails: SendMailArgs[] = (await users()).map(({ email }) => ({
    to: email,
    from,
    subject,
    text: body,
  }))
  const emailPromises = emails.map((email) => sendMail(email))
  const accepted = []
  const rejected = []
  const result = await Promise.allSettled(emailPromises)
  result.forEach((result) => {
    if (result.status === 'fulfilled') {
      accepted.push(result.value.accepted[0])
    } else {
      rejected.push(result.reason)
    }
  })
  await sendMail({
    to: 'k.hutten@protonmail.ch',
    from,
    subject: `All users email report`,
    text: JSON.stringify(
      {
        accepted,
        rejected,
        originalEmailList: emails,
      },
      null,
      2
    ),
  })

  return { accepted, rejected }
}
