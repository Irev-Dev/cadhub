import { routes, navigate } from '@redwoodjs/router'
import { useAuth } from '@redwoodjs/auth'
import { Form, Submit } from '@redwoodjs/forms'
import { toast } from '@redwoodjs/web/toast'

import InputTextForm from 'src/components/InputTextForm'
import MainLayout from 'src/layouts/MainLayout'
import Seo from 'src/components/Seo/Seo'

const UpdatePasswordPage = () => {
  const { client } = useAuth()
  const onSubmit = ({ password, confirm }) => {
    if (password !== confirm || !password) {
      toast.error("Passwords don't match, try again")
      return
    }
    client
      .currentUser()
      .update({ password })
      .then(() => {
        toast.success('Password updated')
        setTimeout(() => {
          navigate(routes.home())
        }, 500)
      })
      .catch(() => {
        toast.error('Problem updating password')
      })
  }
  return (
    <MainLayout>
      <Seo title="Update Password" description="Update Password" lang="en-US" />

      <section className="max-w-md mx-auto mt-20">
        <h2 className="text-xl text-ch-gray-300 pb-4">Reset Password</h2>
        <Form onSubmit={onSubmit}>
          <div
            className="grid items-center gap-2"
            style={{ gridTemplateColumns: 'auto 1fr' }}
          >
            <span className="capitalize text-ch-gray-300 text-sm">
              password
            </span>
            <InputTextForm
              className="text-xl"
              name="password"
              type="password"
              validation={{
                required: true,
              }}
            />
            <span className="capitalize text-ch-gray-300 text-sm">
              confirm
            </span>
            <InputTextForm
              className="text-xl"
              name="confirm"
              type="password"
              validation={{
                required: true,
              }}
            />
            <Submit className="col-start-2 mt-4 bg-ch-purple-400 bg-opacity-50 hover:bg-opacity-80 text-ch-gray-300 flex h-10 flex-shrink-0 justify-center items-center px-4 rounded">
              Update
            </Submit>
          </div>
        </Form>
      </section>
    </MainLayout>
  )
}

export default UpdatePasswordPage
