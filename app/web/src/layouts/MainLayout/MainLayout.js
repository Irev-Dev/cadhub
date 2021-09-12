import { useState, useEffect } from 'react'
import { Link, routes, navigate } from '@redwoodjs/router'
import { useAuth } from '@redwoodjs/auth'
import { Toaster, toast } from '@redwoodjs/web/toast'
import Tooltip from '@material-ui/core/Tooltip'
import { Popover } from '@headlessui/react'
import { getActiveClasses } from 'get-active-classes'
import Footer from 'src/components/Footer'
import { useLocation } from '@redwoodjs/router'
import LoginModal from 'src/components/LoginModal'
import NavPlusButton from 'src/components/NavPlusButton'
import ReactGA from 'react-ga'
import { isBrowser } from '@redwoodjs/prerender/browserUtils'

import Svg from 'src/components/Svg'
import { ImageFallback } from 'src/components/ImageUploader'
import useUser from 'src/helpers/hooks/useUser'

let previousSubmission = ''

const MainLayout = ({ children, shouldRemoveFooterInIde }) => {
  const { logOut, isAuthenticated, currentUser, client } = useAuth()
  const { user, loading } = useUser()
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
  let hash
  if (isBrowser) {
    hash = window.location.hash
  }
  useEffect(() => {
    const [key, token] = hash.slice(1).split('=')
    if (key === 'confirmation_token') {
      client
        .confirm(token, true)
        .then(() => {
          toast.success('Email confirmed')
        })
        .catch(() => {
          toast.error('Problem confirming email')
        })
    } else if (key === 'recovery_token') {
      client
        .recover(token, true)
        .then(() => {
          navigate(routes.updatePassword())
        })
        .catch(() => {
          toast.error('Problem recovering account')
        })
    }
  }, [hash, client])
  return (
    <div className="min-h-screen flex flex-col">
      <header id="cadhub-main-header">
        <nav className="flex justify-between h-16 px-4 bg-ch-gray-900">
          <ul className="flex items-center">
            <li>
              <Link to={routes.home()}>
                <div className="rounded-full overflow-hidden ml-2">
                  <Svg className="w-10" name="favicon" />
                </div>
              </Link>
            </li>
            <li>
              <Tooltip title="Very alpha, there's lots of work todo">
                <div className="ml-4 flex">
                  {/* Because of how specific these styles are to this heading/logo and it doesn't need to be replicated else where as well as it's very precise with the placement of "pre-alpha" I think it's appropriate. */}
                  <h2
                    className="text-indigo-300 text-2xl md:text-5xl font-ropa-sans py-1 md:tracking-wider"
                    style={{ letterSpacing: '0.3em' }}
                  >
                    CadHub
                  </h2>
                  <div
                    className="text-pink-400 text-sm font-bold font-ropa-sans hidden md:block"
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
                'mr-4 md:mr-8 h-8 w-8 md:h-10 md:w-10 flex items-center justify-center'
              )}
            >
              <NavPlusButton />
            </li>
            {isAuthenticated ? (
              <li className="h-10 w-10">
                <Popover className="relative outline-none w-full h-full">
                  <Popover.Button
                    disabled={!isAuthenticated || !currentUser}
                    className="h-full w-full outline-none border-ch-gray-400 border-2 rounded-full">
                    {!loading && (
                      <ImageFallback
                        width={80}
                        className="rounded-full object-cover"
                        imageUrl={user?.image}
                      />
                    )}
                  </Popover.Button>
                  { currentUser && (
                  <Popover.Panel className="w-48 absolute z-10 right-0 bg-ch-gray-700 mt-4 px-3 py-2 rounded shadow-md overflow-hidden text-ch-gray-300">
                      <Link to={routes.user({ userName: user?.userName })}>
                        <h3 className="text-lg hover:text-ch-pink-300">
                          Hello {user?.name}
                        </h3>
                      </Link>
                      <hr className="my-2" />
                      <Link
                        className="my-2 mt-4 block hover:text-ch-pink-300"
                        to={routes.user({ userName: user?.userName })}>
                        <div>View Your Profile</div>
                      </Link>
                      <a href="#" onClick={logOut}
                        className="text-ch-gray-400 hover:text-ch-pink-300">
                        Logout
                      </a>
                  </Popover.Panel>
                  )}
                </Popover>
              </li>
            ) : (
              <li>
                <a
                  href="#"
                  className="text-ch-gray-300 mr-2 px-4 py-2 border-2 border-ch-gray-400 rounded-full hover:bg-ch-gray-600"
                  onClick={recordedLogin}
                >
                  Sign In/Up
                </a>
              </li>
            )}
          </ul>
        </nav>
      </header>
      <Toaster timeout={1500} />
      <LoginModal
        open={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
      <main className="flex-grow bg-ch-gray-800">{children}</main>
      {!shouldRemoveFooterInIde && <Footer />}
    </div>
  )
}

export default MainLayout
