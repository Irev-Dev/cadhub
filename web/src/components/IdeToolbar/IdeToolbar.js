import { useState } from 'react'
import Popover from '@material-ui/core/Popover'
import OutBound from 'src/components/OutBound'
import ReactGA from 'react-ga'
import { Link, routes, navigate } from '@redwoodjs/router'
import { useAuth } from '@redwoodjs/auth'
import { useMutation, useFlash } from '@redwoodjs/web'

import Button from 'src/components/Button'
import ImageUploader from 'src/components/ImageUploader'
import Svg from '../Svg/Svg'
import LoginModal from 'src/components/LoginModal'
import { FORK_PART_MUTATION } from 'src/components/IdePartCell'
import { QUERY as UsersPartsQuery } from 'src/components/PartsOfUserCell'
import useUser from 'src/helpers/hooks/useUser'
import useKeyPress from 'src/helpers/hooks/useKeyPress'
import { captureAndSaveViewport } from 'src/helpers/cloudinary'

const IdeToolbar = ({
  canEdit,
  isChanges,
  onSave,
  onExport,
  userNamePart,
  isDraft,
  code,
  onCapture,
}) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [whichPopup, setWhichPopup] = useState(null)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const { isAuthenticated, currentUser } = useAuth()
  const showForkButton = !(canEdit || isDraft)
  const [title, setTitle] = useState('untitled-part')
  const [captureState, setCaptureState] = useState(false)
  const { user } = useUser()
  useKeyPress((e) => {
    const rx = /INPUT|SELECT|TEXTAREA/i
    const didPressBackspaceOutsideOfInput =
      (e.key == 'Backspace' || e.keyCode == 8) && !rx.test(e.target.tagName)
    if (didPressBackspaceOutsideOfInput) {
      e.preventDefault()
    }
  })

  const { addMessage } = useFlash()
  const [forkPart] = useMutation(FORK_PART_MUTATION, {
    refetchQueries: [
      {
        query: UsersPartsQuery,
        variables: { userName: userNamePart?.userName || user?.userName },
      },
    ],
  })

  const handleClick = ({ event, whichPopup }) => {
    setAnchorEl(event.currentTarget)
    setWhichPopup(whichPopup)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setWhichPopup(null)
  }

  const saveFork = async () => {
    const { publicId } = await captureAndSaveViewport()
    return forkPart({
      variables: {
        input: {
          userId: currentUser.sub,
          title,
          code,
          mainImage: publicId,
        },
      },
    })
  }

  const handleSave = async () => {
    if (isDraft && isAuthenticated) {
      const { data } = await saveFork()
      navigate(
        routes.ide({
          userName: data?.forkPart?.user?.userName,
          partTitle: data?.forkPart?.title,
        })
      )
      addMessage(`Part created with title: ${data?.forkPart?.title}.`, {
        classes: 'rw-flash-success',
      })
    } else if (isAuthenticated) onSave()
    else recordedLogin()
  }

  const handleSaveAndEdit = async () => {
    const { data } = await saveFork()
    const {
      user: { userName },
      title: partTitle,
    } = data?.forkPart || { user: {} }
    navigate(routes.part({ userName, partTitle }))
  }

  const recordedLogin = async () => {
    ReactGA.event({
      category: 'login',
      action: 'ideToolbar signup prompt from fork',
    })
    setIsLoginModalOpen(true)
  }

  const handleDownload = (url) => {
    const aTag = document.createElement('a')
    document.body.appendChild(aTag)
    aTag.href = url
    aTag.style.display = 'none'
    aTag.download = `CadHub_${Date.now()}.jpg`
    aTag.click()
    document.body.removeChild(aTag)
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
      {!isDraft && (
        <>
          <div className="flex items-center">
            <div className="h-8 w-8 ml-4">
              <ImageUploader
                className="rounded-full object-cover"
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
        </>
      )}
      <Button
        iconName={showForkButton ? 'fork' : 'save'}
        className="ml-3 shadow-md hover:shadow-lg border-indigo-600 border-2 border-opacity-0 hover:border-opacity-100 bg-indigo-800 text-indigo-200"
        shouldAnimateHover
        onClick={handleSave}
      >
        {showForkButton ? 'Fork' : 'Save'}
        {isChanges && !isDraft && (
          <span className="relative h-4">
            <span className="text-pink-400 text-2xl absolute transform -translate-y-3">
              *
            </span>
          </span>
        )}
      </Button>
      {isDraft && isAuthenticated && (
        <div className="flex items-center">
          <Button
            iconName={'save'}
            className="ml-3 shadow-md hover:shadow-lg border-indigo-600 border-2 border-opacity-0 hover:border-opacity-100 bg-indigo-800 text-indigo-200 mr-"
            shouldAnimateHover
            onClick={handleSaveAndEdit}
          >
            Save & Edit Profile
          </Button>
          <div className="ml-4 text-indigo-300">title:</div>
          <input
            className="rounded ml-4 px-2"
            value={title}
            onChange={({ target }) =>
              setTitle(target?.value.replace(/([^a-zA-Z\d_:])/g, '-'))
            }
          />
          <div className="w-px ml-4 bg-pink-400 h-10"></div>
        </div>
      )}
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
        {/* Capture Screenshot link. Should only appear if part has been saved and is editable. */}
        {!isDraft && canEdit && (
          <div>
            <button
              onClick={async (event) => {
                handleClick({ event, whichPopup: 'capture' })
                setCaptureState(await onCapture())
              }}
              className="text-indigo-300 flex items-center pr-6"
            >
              Save Part Image <Svg name="camera" className="pl-2 w-8" />
            </button>
            <Popover
              id={id}
              open={whichPopup === 'capture'}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={anchorOrigin}
              transformOrigin={transformOrigin}
              className="material-ui-overrides transform translate-y-4"
            >
              <div className="text-sm p-2 text-gray-500">
                {!captureState ? (
                  'Loading...'
                ) : (
                  <div className="grid grid-cols-2">
                    <div
                      className="rounded m-auto"
                      style={{ width: 'fit-content', overflow: 'hidden' }}
                    >
                      <img src={captureState.imageObjectURL} className="w-32" />
                    </div>
                    <div className="p-2 text-indigo-800">
                      {captureState.currImage && !captureState.updated ? (
                        <button
                          className="flex justify-center mb-4"
                          onClick={async () => {
                            const cloudinaryImg = await captureState.callback()
                            setCaptureState({
                              ...captureState,
                              currImage: cloudinaryImg.public_id,
                              updated: true,
                            })
                          }}
                        >
                          <Svg
                            name="refresh"
                            className="mr-2 w-4 text-indigo-600"
                          />{' '}
                          Update Part Image
                        </button>
                      ) : (
                        <div className="flex justify-center mb-4">
                          <Svg
                            name="checkmark"
                            className="mr-2 w-6 text-indigo-600"
                          />{' '}
                          Part Image Updated
                        </div>
                      )}
                      <Button
                        iconName="save"
                        className="shadow-md hover:shadow-lg border-indigo-600 border-2 border-opacity-0 hover:border-opacity-100 bg-indigo-800 text-indigo-100 text-opacity-100 bg-opacity-80"
                        shouldAnimateHover
                        onClick={() =>
                          handleDownload(captureState.imageObjectURL)
                        }
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Popover>
          </div>
        )}
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
            <div className="p-4">
              <div className="text-sm p-2 text-gray-500">
                Press F5 to regenerate model
              </div>
              <OutBound
                className="text-gray-600 underline p-2"
                to="https://ronie.medium.com/cascade-studio-tutorial-ee2f1c42c829"
              >
                See the tutorial
              </OutBound>
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
            <div className="text-sm p-4 text-gray-500 max-w-md">
              <div className="text-base text-gray-700 py-2">
                Can't export stl/obj/STEP?
              </div>
              Currently exports are only working for chrome and edge browsers
              <p>
                If this problem is frustrating to you, leave a comment on its{' '}
                <OutBound
                  className="text-gray-600 underline"
                  to="https://github.com/zalo/CascadeStudio/pull/39#issuecomment-766206091"
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
