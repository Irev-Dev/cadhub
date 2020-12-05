import { routes, navigate } from '@redwoodjs/router'
import { useAuth } from '@redwoodjs/auth'
import { Form, Submit } from '@redwoodjs/forms'
import { useFlash } from '@redwoodjs/web'

import InputTextForm from 'src/components/InputTextForm'
import MainLayout from 'src/layouts/MainLayout'
import Seo from 'src/components/Seo/Seo'

const UpdatePasswordPage = () => {
  const { addMessage } = useFlash()
  const { client } = useAuth()
  const onSubmit = ({ password, confirm }) => {
    if (password !== confirm || !password) {
      addMessage("Passwords don't match, try again", {
        classes: 'bg-red-300 text-red-900',
      })
      return
    }
    client
      .currentUser()
      .update({ password })
      .then(() => {
        addMessage('Password updated', { classes: 'rw-flash-success' })
        setTimeout(() => {
          navigate(routes.home())
        }, 500)
      })
      .catch(() => {
        addMessage('Problem updating password', {
          classes: 'bg-red-300 text-red-900',
        })
      })
  }
  return (
    <MainLayout>
      <Seo title="Update Password" description="Update Password" lang="en-US" />

      <section className="max-w-md mx-auto mt-20">
        <h2 className="text-xl text-indigo-500 pb-4">Reset Password</h2>
        <Form onSubmit={onSubmit}>
          <div
            className="grid items-center gap-2"
            style={{ gridTemplateColumns: 'auto 1fr' }}
          >
            <span className="capitalize text-gray-500 text-sm align-middle my-3">
              password:
            </span>
            <InputTextForm
              className="text-xl"
              name="password"
              type="password"
              validation={{
                required: true,
              }}
            />
            <span className="capitalize text-gray-500 text-sm align-middle my-3">
              confirm:
            </span>
            <InputTextForm
              className="text-xl"
              name="confirm"
              type="password"
              validation={{
                required: true,
              }}
            />
          </div>
          <Submit className="bg-indigo-200 text-indigo-800 p-2 px-4 shadow hover:shadow-lg mt-4 rounded">
            Update
          </Submit>
        </Form>
      </section>
    </MainLayout>
  )
}

export default UpdatePasswordPage
