import { useState } from 'react'
import Popover from '@material-ui/core/Popover'
import OutBound from 'src/components/OutBound'
import ReactGA from 'react-ga'
import { Link, routes, navigate } from '@redwoodjs/router'
import { useAuth } from '@redwoodjs/auth'

import Button from 'src/components/Button'
import ImageUploader from 'src/components/ImageUploader'
import Svg from '../Svg/Svg'
import LoginModal from '../LoginModal/LoginModal'

const IdeToolbar = ({ canEdit, isChanges, onSave, onExport, userNamePart }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [whichPopup, setWhichPopup] = useState(null)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const { isAuthenticated } = useAuth()

  const handleClick = ({ event, whichPopup }) => {
    setAnchorEl(event.currentTarget)
    setWhichPopup(whichPopup)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setWhichPopup(null)
  }

  const handleSave = () => {
    if (isAuthenticated) onSave()
    else recordedLogin()
  }

  const recordedLogin = async () => {
    ReactGA.event({
      category: 'login',
      action: 'ideToolbar signup prompt from fork',
    })
    setIsLoginModalOpen(true)
  }

  const anchorOrigin = {
    vertical: 'bottom',
    horizontal: 'center',
  }
  const transformOrigin = {
    vertical: 'top',
    horizontal: 'center',
  }

  const id = open ? 'simple-popover' : undefined

  return (
    <div
      id="cadhub-ide-toolbar"
      className="flex bg-gradient-to-r from-gray-900 to-indigo-900 pt-1"
    >
      <div className="flex items-center">
        <div className="h-8 w-8 ml-4">
          <ImageUploader
            className="rounded-full object-cover"
            onImageUpload={() => {}}
            aspectRatio={1}
            imageUrl={userNamePart?.image}
            width={80}
          />
        </div>
        <div className="text-indigo-400 ml-2 mr-8">
          <Link to={routes.user({ userName: userNamePart?.userName })}>
            {userNamePart?.userName}
          </Link>
        </div>
      </div>
      <Button
        iconName="arrow-left"
        className="ml-3 shadow-md hover:shadow-lg border-indigo-600 border-2 border-opacity-0 hover:border-opacity-100 bg-indigo-800 text-indigo-200"
        shouldAnimateHover
        onClick={() => {
          navigate(routes.part(userNamePart))
        }}
      >
        Part Profile
      </Button>
      <Button
        iconName={canEdit ? 'save' : 'fork'}
        className="ml-3 shadow-md hover:shadow-lg border-indigo-600 border-2 border-opacity-0 hover:border-opacity-100 bg-indigo-800 text-indigo-200"
        shouldAnimateHover
        onClick={handleSave}
      >
        {canEdit ? 'Save' : 'Fork'}
        {isChanges && (
          <span className="relative h-4">
            <span className="text-pink-400 text-2xl absolute transform -translate-y-3">
              *
            </span>
          </span>
        )}
      </Button>
      <div>
        <Button
          iconName="logout"
          className="ml-3 shadow-md hover:shadow-lg border-indigo-600 border-2 border-opacity-0 hover:border-opacity-100 bg-indigo-800 text-indigo-200"
          shouldAnimateHover
          aria-describedby={id}
          onClick={(event) => handleClick({ event, whichPopup: 'export' })}
        >
          Export
        </Button>
        <Popover
          id={id}
          open={whichPopup === 'export'}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={anchorOrigin}
          transformOrigin={transformOrigin}
          className="material-ui-overrides transform translate-y-4"
        >
          <ul className="text-sm py-2 text-gray-500">
            {['STEP', 'STL', 'OBJ'].map((exportType) => (
              <li key={exportType} className="px-4 py-2 hover:bg-gray-200">
                <button onClick={() => onExport(exportType)}>
                  export
                  <span className="pl-1 text-base text-indigo-600">
                    {exportType}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Popover>
      </div>
      <div className="ml-auto flex items-center">
        <div>
          <button
            onClick={(event) => handleClick({ event, whichPopup: 'tips' })}
            className="text-indigo-300 flex items-center pr-6"
          >
            Tips <Svg name="lightbulb" className="pl-2 w-8" />
          </button>
          <Popover
            id={id}
            open={whichPopup === 'tips'}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={anchorOrigin}
            transformOrigin={transformOrigin}
            className="material-ui-overrides transform translate-y-4"
          >
            <div className="text-sm p-2 text-gray-500">
              Press F5 to regenerate model
            </div>
          </Popover>
        </div>
        <div>
          <button
            onClick={(event) => handleClick({ event, whichPopup: 'feedback' })}
            className="text-indigo-300 flex items-center pr-6"
          >
            Feedback <Svg name="flag" className="pl-2 w-8" />
          </button>
          <Popover
            id={id}
            open={whichPopup === 'feedback'}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={anchorOrigin}
            transformOrigin={transformOrigin}
            className="material-ui-overrides transform translate-y-4"
          >
            <div className="text-sm p-2 text-gray-500 max-w-md">
              If there's a feature you really want or you found a bug, either
              make a{' '}
              <OutBound
                className="text-gray-600 underline"
                to="https://github.com/Irev-Dev/cadhub/issues"
              >
                github issue
              </OutBound>{' '}
              or swing by the{' '}
              <OutBound
                className="text-gray-600 underline"
                to="https://discord.gg/SD7zFRNjGH"
              >
                discord server
              </OutBound>
              .
            </div>
          </Popover>
        </div>
        <div>
          <button
            onClick={(event) => handleClick({ event, whichPopup: 'issues' })}
            className="text-indigo-300 flex items-center pr-6"
          >
            Known issues <Svg name="exclamation-circle" className="pl-2 w-8" />
          </button>
          <Popover
            id={id}
            open={whichPopup === 'issues'}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={anchorOrigin}
            transformOrigin={transformOrigin}
            className="material-ui-overrides transform translate-y-4"
          >
            <div className="text-sm p-2 text-gray-500 max-w-md">
              <div className="text-base text-gray-700 py-2">
                Model never generating?
              </div>
              Due to the current integration with CascadeStudio and the order in
              which the code initialise sometimes the 3d model never generates
              <div className="text-base text-gray-700 py-2">Work around</div>
              <p>
                Usually going to the <a href="/">homepage</a>, then refreshing,
                waiting a good 10 seconds before navigating back to the part
                your interested in should fix the issue.
              </p>
              <p>
                If this problem is frustrating to you, leave a comment on its{' '}
                <OutBound
                  className="text-gray-600 underline"
                  to="https://github.com/Irev-Dev/cadhub/issues/139"
                >
                  github issue
                </OutBound>{' '}
                to help prioritize it.
              </p>
            </div>
          </Popover>
        </div>
      </div>
      <LoginModal
        open={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        shouldStartWithSignup
      />
    </div>
  )
}

export default IdeToolbar
