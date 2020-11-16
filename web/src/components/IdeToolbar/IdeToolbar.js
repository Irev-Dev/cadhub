import { useState } from 'react'
import Popover from '@material-ui/core/Popover'
import { Link, routes, navigate } from '@redwoodjs/router'

import Button from 'src/components/Button'
import ImageUploader from 'src/components/ImageUploader'

const IdeToolbar = ({ canEdit, isChanges, onSave, onExport, userNamePart }) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
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
          <Link to={routes.user2({ userName: userNamePart?.userName })}>
            {userNamePart?.userName}
          </Link>
        </div>
      </div>
      <Button
        iconName="arrow-left"
        className="ml-3 shadow-md hover:shadow-lg border-indigo-600 border-2 border-opacity-0 hover:border-opacity-100 bg-indigo-800 text-indigo-200"
        shouldAnimateHover
        onClick={() => {
          navigate(routes.part2(userNamePart))
        }}
      >
        Part Profile
      </Button>
      <Button
        iconName={canEdit ? 'save' : 'fork'}
        className="ml-3 shadow-md hover:shadow-lg border-indigo-600 border-2 border-opacity-0 hover:border-opacity-100 bg-indigo-800 text-indigo-200"
        shouldAnimateHover
        onClick={onSave}
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
          onClick={handleClick}
        >
          Export
        </Button>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
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
    </div>
  )
}

export default IdeToolbar
