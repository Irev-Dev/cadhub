import { useState, useEffect } from 'react'
import { Link, routes, navigate } from '@redwoodjs/router'
import { useAuth } from '@redwoodjs/auth'
import { Toaster, toast } from '@redwoodjs/web/toast'
import { Popover } from '@headlessui/react'
import { getActiveClasses } from 'get-active-classes'
import Footer from 'src/components/Footer'
import { useLocation } from '@redwoodjs/router'
import LoginModal from 'src/components/LoginModal'
import NavPlusButton from 'src/components/NavPlusButton'
import ReactGA from 'react-ga'
import { isBrowser } from '@redwoodjs/prerender/browserUtils'

import { ImageFallback } from 'src/components/ImageUploader'
import useUser from 'src/helpers/hooks/useUser'
import './MainLayout.css'
import RecentProjectsCell from 'src/components/RecentProjectsCell'
import LogoType from 'src/components/LogoType'

let previousSubmission = ''

const MainLayout = ({ children, shouldRemoveFooterInIde }) => {
  const { logOut, isAuthenticated, currentUser, client } = useAuth()
  const { user, loading } = useUser()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

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
    <div
      className="flex flex-col h-full overflow-x-hidden overflow-y-scroll ch-scrollbar"
      style={{ perspective: '1px', perspectiveOrigin: 'top center' }}
    >
      <header id="cadhub-main-header">
        <nav className="flex justify-between h-16 sm:px-4 bg-ch-gray-900">
          <LogoType />
          <ul className="flex items-center">
            <li
              className={getActiveClasses(
                'mr-1 sm:mr-4 md:mr-8 h-8 w-8 md:h-10 md:w-10 flex items-center justify-center'
              )}
            >
              <NavPlusButton />
            </li>
            {isAuthenticated ? (
              <li className="w-10 h-10">
                <Popover className="relative w-full h-full outline-none">
                  <Popover.Button
                    disabled={!isAuthenticated || !currentUser}
                    className="w-full h-full border-2 rounded-full outline-none border-ch-gray-400"
                  >
                    {!loading && (
                      <ImageFallback
                        width={80}
                        className="object-cover rounded-full"
                        imageId={user?.image}
                      />
                    )}
                  </Popover.Button>
                  {currentUser && (
                    <Popover.Panel className="absolute right-0 z-10 w-48 px-3 py-2 mt-4 overflow-hidden rounded shadow-md bg-ch-gray-700 text-ch-gray-300">
                      <Link to={routes.user({ userName: user?.userName })}>
                        <p className="my-2 text-sm leading-4 text-ch-blue-400 font-fira-code">
                          Hello {user?.name}
                        </p>
                      </Link>
                      <Link
                        className="block my-2 hover:text-ch-pink-300"
                        to={routes.user({ userName: user?.userName })}
                      >
                        <div>View Your Profile</div>
                      </Link>
                      <a
                        href="#"
                        onClick={logOut}
                        className="my-2 text-ch-gray-400 hover:text-ch-pink-300"
                      >
                        Logout
                      </a>
                      <hr className="my-4" />
                      <p className="text-sm leading-4 text-ch-blue-400 font-fira-code">
                        Recent Projects
                      </p>
                      <RecentProjectsCell userName={user?.userName} />
                    </Popover.Panel>
                  )}
                </Popover>
              </li>
            ) : (
              <li>
                <a
                  href="#"
                  className="px-2 py-2 mr-1 border-2 rounded-full text-ch-gray-300 sm:mr-2 sm:px-4 border-ch-gray-400 hover:bg-ch-gray-600"
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
      <main className="flex-grow bg-ch-gray-800 preserve-3d-for-children">
        {children}
      </main>
      {!shouldRemoveFooterInIde && <Footer />}
    </div>
  )
}

export default MainLayout
