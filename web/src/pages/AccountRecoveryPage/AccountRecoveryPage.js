import { routes, navigate } from '@redwoodjs/router'
import { useAuth } from '@redwoodjs/auth'
import { Form, Submit } from '@redwoodjs/forms'
import { useFlash } from '@redwoodjs/web'

import InputTextForm from 'src/components/InputTextForm'
import MainLayout from 'src/layouts/MainLayout'
import Seo from 'src/components/Seo/Seo'

const AccountRecoveryPage = () => {
  const { addMessage } = useFlash()
  const { client } = useAuth()
  const onSubmit = ({ email }) => {
    client
      .requestPasswordRecovery(email)
      .then(() => {
        addMessage('Email sent', { classes: 'rw-flash-success' })
        setTimeout(() => {
          navigate(routes.home())
        }, 500)
      })
      .catch(() => {
        addMessage('Problem sending email', {
          classes: 'bg-red-300 text-red-900',
        })
      })
  }
  return (
    <MainLayout>
      <Seo
        title="Account recovery"
        description="Send recovery email"
        lang="en-US"
      />

      <section className="max-w-md mx-auto mt-20">
        <h2 className="text-xl text-indigo-500 pb-4">Send recovery email</h2>
        <Form onSubmit={onSubmit}>
          <div
            className="grid items-center gap-2"
            style={{ gridTemplateColumns: 'auto 1fr' }}
          >
            <span className="capitalize text-gray-500 text-sm align-middle my-3">
              email:
            </span>
            <InputTextForm
              className="text-xl"
              name="email"
              validation={{
                required: true,
                pattern: {
                  value: /[^@]+@[^.]+\..+/,
                  message: 'please enter a valid email address',
                },
              }}
            />
          </div>
          <Submit className="bg-indigo-200 text-indigo-800 p-2 px-4 shadow hover:shadow-lg mt-4 rounded">
            Send email
          </Submit>
        </Form>
      </section>
    </MainLayout>
  )
}

export default AccountRecoveryPage
