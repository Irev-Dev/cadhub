import { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import InputTextForm from 'src/components/InputTextForm/InputTextForm'
import OutBound from 'src/components/OutBound/OutBound'
import { Form, Submit } from '@redwoodjs/forms'
import { useAuth } from '@redwoodjs/auth'
import { toast } from '@redwoodjs/web/toast'
import { Link, routes } from '@redwoodjs/router'
import { subscribe } from 'src/helpers/subscribe'

const useStyles = makeStyles({
  root: {
    transform: `translate3d(0,0,50px)`,
  },
})

const LoginModal = ({ open, onClose, shouldStartWithSignup = false }) => {
  const { logIn, signUp } = useAuth()

  const [tab, setTab] = useState(shouldStartWithSignup ? 0 : 1)
  const onTabChange = (_, newValue) => {
    setTab(newValue)
    setError('')
  }
  const [checkBox, setCheckBox] = useState(true)
  const [error, setError] = useState('')
  const classes = useStyles()

  const onSubmitSignUp = async ({ email, password, name, userName }) => {
    try {
      setError('')
      if (checkBox) {
        subscribe({ email, addMessage: (msg) => toast.error(msg), name })
      }
      const { isUserNameAvailable } = await fetch(
        `/.netlify/functions/check-user-name?username=${userName}`
      ).then((res) => res.json())
      if (!isUserNameAvailable) {
        setError('UserName is already taken, please try something else')
        return
      }
      await signUp({
        email,
        password,
        remember: { full_name: name, userName },
      })
      toast(
        'Look out for a verification email to finish making your account.',
        {
          icon: '📬',
          duration: 8000,
        }
      )
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
    <Dialog
      open={open}
      onClose={onClose}
      className={classes.root}
      PaperProps={{
        style: {
          backgroundColor: 'transparent',
        },
      }}
    >
      <div className="bg-ch-gray-700 max-w-2xl rounded-lg shadow-lg text-ch-gray-300">
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
            onClose={onClose}
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
    <span className="capitalize text-ch-gray-300 text-right text-sm align-middle my-3">
      {name}
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
  <Submit className="bg-texture bg-ch-purple-400 bg-opacity-50 py-6 w-full flex items-center justify-center rounded-b border border-indigo-300 border-opacity-0 hover:bg-opacity-80 hover:shadow-xl">
    <span className="text-3xl text-ch-purple-600">{text}</span>
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
        <div></div>
        <Link
          to={routes.accountRecovery()}
          className="underline text-sm text-ch-gray-400 block mt-4"
        >
          forgot your password?
        </Link>
      </div>
    </div>
    <HeroButton text="Sign In" />
  </Form>
)

const SignUpForm = ({ onSubmitSignUp, checkBox, setCheckBox, onClose }) => (
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
            minLength: {
              value: 5,
              message: 'Not enough Characters',
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
        <input
          type="checkbox"
          id="signup-toc"
          className="justify-self-end mr-2"
          checked={checkBox}
          onChange={() => setCheckBox(!checkBox)}
        />{' '}
        <label
          htmlFor="signup-toc"
          className="text-ch-gray-400 text-sm mt-4 cursor-pointer"
        >
          Stay up-to-date with CadHub's progress with the founder's (
          <OutBound className="underline" to="https://twitter.com/IrevDev">
            Kurt's
          </OutBound>
          ) newsletter
        </label>
      </div>
      <span className="text-sm text-ch-gray-400 block text-center pt-4">
        Use of CadHub requires you to abide by our{' '}
        <Link
          onClick={onClose}
          to={routes.codeOfConduct()}
          className="underline"
        >
          Code of Conduct
        </Link>
        , and agree with our{' '}
        <Link
          onClick={onClose}
          to={routes.privacyPolicy()}
          className="underline"
        >
          Privacy Policy
        </Link>
      </span>
    </div>
    <HeroButton text="Sign Up" />
  </Form>
)

export default LoginModal
