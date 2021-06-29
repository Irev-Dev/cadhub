import nodemailer, { SendMailOptions } from 'nodemailer'

interface Args {
  to: SendMailOptions['to']
  from: SendMailOptions['from']
  subject: string
  text: string
}

interface SuccessResult {
  accepted: string[]
  rejected: string[]
  envelopeTime: number
  messageTime: number
  messageSize: number
  response: string
  envelope: {
    from: string | false
    to: string[]
  }
  messageId: string
}

export function sendMail({
  to,
  from,
  subject,
  text,
}: Args): Promise<SuccessResult> {
  const transporter = nodemailer.createTransport({
    host: 'smtp.mailgun.org',
    port: 587,
    secure: false,
    tls: {
      ciphers: 'SSLv3',
    },
    auth: {
      user: 'postmaster@mail.cadhub.xyz',
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  console.log({ to, from, subject, text })

  const emailPromise = new Promise((resolve, reject) => {
    transporter.sendMail(
      {
        from,
        to,
        subject,
        text,
      },
      (error, info) => {
        if (error) {
          reject(error)
        } else {
          resolve(info)
        }
      }
    )
  }) as any as Promise<SuccessResult>
  return emailPromise
}
