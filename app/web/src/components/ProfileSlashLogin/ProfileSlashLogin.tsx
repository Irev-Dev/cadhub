import { useState } from 'react'
import { useAuth } from '@redwoodjs/auth'
import { Link, routes } from '@redwoodjs/router'
import ReactGA from 'react-ga'
import { Popover } from '@headlessui/react'
import { ImageFallback } from 'src/components/ImageUploader'

import useUser from 'src/helpers/hooks/useUser'
import LoginModal from 'src/components/LoginModal'
import Gravatar from 'src/components/Gravatar/Gravatar'

const ProfileSlashLogin = () => {
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
  return (
    <div className="flex-shrink-0">
      {isAuthenticated ? (
        <Popover className="relative outline-none h-8 w-8">
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
      ) : (
        <div>
          <a
            href="#"
            className="text-indigo-200 font-semibold underline mr-2"
            onClick={recordedLogin}
          >
            Sign in/up
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
