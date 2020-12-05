import { useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import InputTextForm from 'src/components/InputTextForm'
import OutBound from 'src/components/OutBound'
import { Form, Submit } from '@redwoodjs/forms'
import { useAuth } from '@redwoodjs/auth'
import { useFlash } from '@redwoodjs/web'
import { Link, routes } from '@redwoodjs/router'
import { subscribe } from 'src/helpers/subscribe'

const LoginModal = ({ open, onClose, shouldStartWithSignup = false }) => {
  const { logIn, signUp } = useAuth()
  const { addMessage } = useFlash()

  const [tab, setTab] = useState(shouldStartWithSignup ? 0 : 1)
  const onTabChange = (_, newValue) => {
    setTab(newValue)
    setError('')
  }
  const [checkBox, setCheckBox] = useState(true)
  const [error, setError] = useState('')

  const onSubmitSignUp = async ({ email, password, name, userName }) => {
    try {
      setError('')
      if (checkBox) {
        subscribe({ email, addMessage })
      }
      await signUp({
        email,
        password,
        remember: { full_name: name, userName },
      })
      onClose()
    } catch (errorEvent) {
      setError(errorEvent?.json?.error_description)
    }
  }
  const onSubmitSignIn = async ({ email, password }) => {
    try {
      setError('')
      await logIn({ email, password, remember: true })
      onClose()
    } catch (errorEvent) {
      setError(errorEvent?.json?.error_description)
    }
  }
  return (
    <Dialog open={open} onClose={onClose}>
      <div className="bg-gray-100 max-w-2xl rounded-lg shadow-lg">
        <Tabs
          value={tab}
          onChange={onTabChange}
          centered
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Sign Up" />
          <Tab label="Sign In" />
        </Tabs>
        {error && (
          <div className="text-sm text-red-500 font-ropa-sans pt-4 text-center">
            {error}
          </div>
        )}
        {tab === 0 ? (
          <SignUpForm
            onSubmitSignUp={onSubmitSignUp}
            checkBox={checkBox}
            setCheckBox={setCheckBox}
          />
        ) : (
          <SignInForm onSubmitSignIn={onSubmitSignIn} />
        )}
      </div>
    </Dialog>
  )
}

const Field = ({ name, type = 'text', validation }) => (
  <>
    <span className="capitalize text-gray-500 text-sm align-middle my-3">
      {name}:
    </span>
    <InputTextForm
      type={type}
      className="text-xl"
      name={name}
      validation={validation}
    />
  </>
)

const HeroButton = ({ text }) => (
  <Submit className="bg-texture bg-purple-800 py-6 w-full flex items-center justify-center rounded-b border border-indigo-300 border-opacity-0 hover:border-opacity-100 hover:shadow-xl">
    <span className="font-bold text-2xl text-indigo-200">{text}</span>
  </Submit>
)

const SignInForm = ({ onSubmitSignIn }) => (
  <Form className="w-full" onSubmit={onSubmitSignIn}>
    <div className="p-8">
      <div
        className="grid items-center gap-2"
        style={{ gridTemplateColumns: 'auto 1fr' }}
      >
        <Field
          name="email"
          validation={{
            required: true,
            pattern: {
              value: /[^@]+@[^.]+\..+/,
              message: 'please enter a valid email address',
            },
          }}
        />
        <Field
          name="password"
          type="password"
          validation={{ required: true }}
        />
      </div>
      <Link
        to={routes.accountRecovery()}
        className="underline text-sm text-gray-500 block text-center"
      >
        forgot your password?
      </Link>
    </div>
    <HeroButton text="Sign In" />
  </Form>
)

const SignUpForm = ({ onSubmitSignUp, checkBox, setCheckBox }) => (
  <Form className="w-full" onSubmit={onSubmitSignUp}>
    <div className="p-8">
      <div
        className="grid items-center gap-2"
        style={{ gridTemplateColumns: 'auto 1fr' }}
      >
        <Field name="name" validation={{ required: true }} />
        <Field
          name="userName"
          validation={{
            required: true,
            pattern: {
              value: /^[a-zA-Z0-9-_]+$/,
              message: 'Only alphanumeric and dash characters allowed',
            },
          }}
        />
        <Field
          name="email"
          validation={{
            required: true,
            pattern: {
              value: /[^@]+@[^.]+\..+/,
              message: 'please enter a valid email address',
            },
          }}
        />
        <Field
          name="password"
          type="password"
          validation={{ required: true }}
        />
      </div>
      <div className="flex pt-4">
        <input
          type="checkbox"
          checked={checkBox}
          onChange={() => setCheckBox(!checkBox)}
        />{' '}
        <span className="pl-4 text-gray-500 text-sm max-w-sm">
          Stay up-to-date with CadHub's progress with the founder's (
          <OutBound className="underline" to="https://twitter.com/IrevDev">
            Kurt's
          </OutBound>
          ) newsletter
        </span>
      </div>
    </div>
    <HeroButton text="Sign Up" />
  </Form>
)

export default LoginModal
