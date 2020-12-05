import { useState, useEffect } from 'react'
import { Link, routes, navigate } from '@redwoodjs/router'
import { useAuth } from '@redwoodjs/auth'
import { Flash, useQuery, useFlash } from '@redwoodjs/web'
import Tooltip from '@material-ui/core/Tooltip'
import Popover from '@material-ui/core/Popover'
import { getActiveClasses } from 'get-active-classes'
import { useLocation } from '@redwoodjs/router'
import LoginModal from 'src/components/LoginModal'
import ReactGA from 'react-ga'

export const QUERY = gql`
  query FIND_USER_BY_ID($id: String!) {
    user: user(id: $id) {
      id
      image
      userName
      name
    }
  }
`
import Svg from 'src/components/Svg'
import ImageUploader from 'src/components/ImageUploader'

let previousSubmission = ''
let previousUserID = ''

const MainLayout = ({ children }) => {
  const { logOut, isAuthenticated, currentUser, client } = useAuth()
  const { addMessage } = useFlash()
  const { data, loading } = useQuery(QUERY, {
    skip: !currentUser?.sub,
    variables: { id: currentUser?.sub },
  })
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [popoverId, setPopoverId] = useState(undefined)
  const openPopover = (target) => {
    setAnchorEl(target)
    setPopoverId('simple-popover')
    setIsOpen(true)
  }

  const closePopover = () => {
    setAnchorEl(null)
    setPopoverId(undefined)
    setIsOpen(false)
  }

  const togglePopover = ({ currentTarget }) => {
    if (isOpen) {
      return closePopover()
    }

    openPopover(currentTarget)
  }

  const recordedLogin = () => {
    ReactGA.event({
      category: 'login',
      action: 'navbar login',
    })
    setIsLoginModalOpen(true)
  }

  const { pathname, params } = useLocation()

  useEffect(() => {
    const newSubmission = `${pathname || ''}${params || ''}`
    // not the "React" way of doing think, but otherwise it will submit twice
    // it's because the old page submits it and when the new page loads it happens again
    if (previousSubmission !== newSubmission) {
      ReactGA.pageview(newSubmission)
      previousSubmission = newSubmission
    }
  }, [pathname, params])
  useEffect(() => {
    // not the "React" way of doing think, but otherwise it will submit twice
    // it's because the old page submits it and when the new page loads it happens again
    if (
      isAuthenticated &&
      previousUserID !== currentUser &&
      data?.user?.userName
    ) {
      ReactGA.set({ userName: data.user.userName, userId: currentUser })
      previousUserID = currentUser
    }
  }, [data, currentUser, isAuthenticated])
  const hash = window.location.hash
  useEffect(() => {
    const [key, token] = hash.slice(1).split('=')
    if (key === 'confirmation_token') {
      console.log('confirming with', token)
      client
        .confirm(token, true)
        .then(() => {
          addMessage('Email confirmed', { classes: 'rw-flash-success' })
        })
        .catch(() => {
          addMessage('Problem confirming email', {
            classes: 'bg-red-300 text-red-900',
          })
        })
    } else if (key === 'recovery_token') {
      client
        .recover(token, true)
        .then(() => {
          navigate(routes.updatePassword())
        })
        .catch(() => {
          addMessage('Problem recovering account', {
            classes: 'bg-red-300 text-red-900',
          })
        })
    }
  }, [hash, client]) // complaining about not having addMessage, however adding it puts useEffect into a loop
  return (
    <>
      <header id="cadhub-main-header">
        <nav className="flex justify-between h-20 px-12 bg-gradient-to-r from-gray-900 to-indigo-900">
          <ul className="flex items-center">
            <li>
              <Link to={routes.home()}>
                <div className="rounded-full overflow-hidden ml-8">
                  <Svg className="w-16" name="favicon" />
                </div>
              </Link>
            </li>
            <li>
              <Tooltip title="Very alpha, there's lots of work todo">
                <div className="ml-12 flex">
                  {/* Because of how specific these styles are to this heading/logo and it doesn't need to be replicated else where as well as it's very precise with the placement of "pre-alpha" I think it's appropriate. */}
                  <h2
                    className="text-indigo-300 text-5xl font-ropa-sans py-1 tracking-wider"
                    style={{ letterSpacing: '0.3em' }}
                  >
                    CadHub
                  </h2>
                  <div
                    className="text-pink-400 text-sm font-bold font-ropa-sans"
                    style={{ paddingBottom: '2rem', marginLeft: '-1.8rem' }}
                  >
                    pre-alpha
                  </div>
                </div>
              </Tooltip>
            </li>
          </ul>
          <ul className="flex items-center">
            <li
              className={getActiveClasses(
                'mr-8 h-10 w-10 rounded-full border-2 border-gray-700 flex items-center justify-center',
                { 'border-indigo-300': currentUser }
              )}
            >
              {isAuthenticated && data?.user?.userName ? (
                <Link
                  className="h-full w-full"
                  to={routes.newPart2({ userName: data?.user?.userName })}
                >
                  <Svg name="plus" className="text-indigo-300 w-full h-full" />
                </Link>
              ) : (
                <Svg name="plus" className="text-gray-700 w-full h-full" />
              )}
            </li>
            {isAuthenticated ? (
              <li
                className="h-10 w-10 border-2 rounded-full border-indigo-300 text-indigo-200"
                aria-describedby={popoverId}
              >
                <button className="w-full h-full" onClick={togglePopover}>
                  {!loading && (
                    <ImageUploader
                      className="rounded-full object-cover"
                      onImageUpload={() => {}}
                      aspectRatio={1}
                      imageUrl={data?.user?.image}
                      width={80}
                    />
                  )}
                </button>
              </li>
            ) : (
              <li>
                <a
                  href="#"
                  className="text-indigo-200 font-semibold underline"
                  onClick={recordedLogin}
                >
                  Sign in/up
                </a>
              </li>
            )}
          </ul>
          {isAuthenticated && currentUser && (
            <Popover
              id={popoverId}
              open={isOpen}
              anchorEl={anchorEl}
              onClose={closePopover}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <div className="p-4 w-40">
                <Link to={routes.user2({ userName: data?.user?.userName })}>
                  <h3 className="text-indigo-800" style={{ fontWeight: '500' }}>
                    Hello {data?.user?.name}
                  </h3>
                </Link>
                <hr />
                <br />
                <Link to={routes.editUser2({ userName: data?.user?.userName })}>
                  <div className="text-indigo-800">Edit Profile</div>
                </Link>
                <a href="#" className="text-indigo-800" onClick={logOut}>
                  Logout
                </a>
              </div>
            </Popover>
          )}
        </nav>
      </header>
      <Flash timeout={1500} />
      <LoginModal
        open={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
      <main>{children}</main>
    </>
  )
}

export default MainLayout
