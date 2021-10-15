import { useState } from 'react'
import { useAuth } from '@redwoodjs/auth'
import { Link, routes } from '@redwoodjs/router'
import ReactGA from 'react-ga'
import { Popover } from '@headlessui/react'
import { ImageFallback } from 'src/components/ImageUploader'

import useUser from 'src/helpers/hooks/useUser'
import LoginModal from 'src/components/LoginModal'
import RecentProjectsCell from 'src/components/RecentProjectsCell'

const ProfileSlashLogin = () => {
  const { logOut, isAuthenticated, currentUser } = useAuth()
  const { user, loading } = useUser()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const recordedLogin = () => {
    ReactGA.event({
      category: 'login',
      action: 'navbar login',
    })
    setIsLoginModalOpen(true)
  }
  return (
    <div className="flex-shrink-0">
      {isAuthenticated ? (
        <Popover className="relative outline-none h-8 w-8">
          <Popover.Button
            disabled={!isAuthenticated || !currentUser}
            className="h-full w-full outline-none border-ch-gray-400 border-2 rounded-full"
          >
            {!loading && (
              <ImageFallback
                width={80}
                className="rounded-full object-cover"
                imageId={user?.image}
              />
            )}
          </Popover.Button>
          {currentUser && (
            <Popover.Panel className="w-48 absolute z-10 right-0 bg-ch-gray-700 mt-4 px-3 py-2 rounded shadow-md overflow-hidden text-ch-gray-300">
              <Link
                to={routes.user({
                  userName: user?.userName || currentUser.userName,
                })}
              >
                <p className="my-2 text-ch-blue-400 font-fira-code leading-4 text-sm">
                  Hello {user?.name}
                </p>
              </Link>
              <Link
                className="my-2 block hover:text-ch-pink-300"
                to={routes.user({
                  userName: user?.userName || currentUser.userName,
                })}
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
              <p className="text-ch-blue-400 font-fira-code leading-4 text-sm">
                Recent Projects
              </p>
              <RecentProjectsCell
                userName={user?.userName || currentUser.userName}
              />
            </Popover.Panel>
          )}
        </Popover>
      ) : (
        <div>
          <a
            href="#"
            className="text-sm text-ch-gray-300 mr-2 py-2 px-3 border-2 border-ch-gray-400 rounded-full hover:bg-ch-gray-600"
            onClick={recordedLogin}
          >
            Sign In/Up
          </a>
        </div>
      )}
      <LoginModal
        open={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  )
}

export default ProfileSlashLogin
