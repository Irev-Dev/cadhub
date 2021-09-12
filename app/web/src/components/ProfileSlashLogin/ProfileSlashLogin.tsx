import { useState } from 'react'
import { useAuth } from '@redwoodjs/auth'
import { Link, routes } from '@redwoodjs/router'
import ReactGA from 'react-ga'
import Popover from '@material-ui/core/Popover'

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
        <div
          className="h-8 w-8 relative text-indigo-200"
          aria-describedby={popoverId}
        >
          <button
            className="absolute inset-0 w-full h-full"
            onClick={togglePopover}
          >
            {!loading && <Gravatar image={user?.image} />}
          </button>
        </div>
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
          <div className="p-4 w-48">
            <Link to={routes.user({ userName: user?.userName })}>
              <h3 className="text-indigo-800" style={{ fontWeight: '500' }}>
                Hello {user?.name}
              </h3>
            </Link>
            <hr />
            <br />
            <Link to={routes.user({ userName: user?.userName })}>
              <div className="text-indigo-800">Your Profile</div>
            </Link>
            <a href="#" className="text-indigo-800" onClick={logOut}>
              Logout
            </a>
          </div>
        </Popover>
      )}
      <LoginModal
        open={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  )
}

export default ProfileSlashLogin
