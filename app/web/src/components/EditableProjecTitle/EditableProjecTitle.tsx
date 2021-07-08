import { useState } from 'react'
import { toast } from '@redwoodjs/web/toast'
import { Link, navigate, routes } from '@redwoodjs/router'
import { useUpdateProject } from 'src/helpers/hooks/useUpdateProject'

import Svg from 'src/components/Svg/Svg'

interface EditableProjectTitleProps {
  id: string
  userName: string
  projectTitle: string
  canEdit: boolean
  shouldRouteToIde: boolean
}

const EditableProjectTitle = ({
  id,
  userName,
  projectTitle,
  canEdit,
  shouldRouteToIde,
}: EditableProjectTitleProps) => {
  const [inEditMode, setInEditMode] = useState(false)
  const [newTitle, setNewTitle] = useState(projectTitle)
  const inputRef = React.useRef(null)

  const { updateProject, loading, error } = useUpdateProject({
    onCompleted: ({ updateProject }) => {
      const routeVars = {
        userName: updateProject.user.userName,
        projectTitle: updateProject.title,
      }
      navigate(
        shouldRouteToIde ? routes.ide(routeVars) : routes.project(routeVars)
      )
      toast.success('Project updated.')
    },
  })
  const onTitleChange = ({ target }) =>
    setNewTitle(target.value.replace(/([^a-zA-Z\d_:])/g, '-'))
  return (
    <>
      {!inEditMode && (
        <>
          <Link
            to={routes.project({
              userName,
              projectTitle,
            })}
            className="pl-4"
          >
            /{projectTitle}
          </Link>
          {canEdit && (
            <button
              onClick={() => {
                setInEditMode(true)
                setTimeout(() => inputRef?.current?.focus())
              }}
            >
              <Svg name="pencil-solid" className="h-4 w-4 ml-4 mb-2" />
            </button>
          )}
        </>
      )}
      {inEditMode && (
        <>
          <span className="flex items-center ml-4 border border-ch-gray-300 rounded-sm">
            <span className="ml-1">/</span>
            <input
              className="pl-1 bg-ch-gray-900"
              value={newTitle}
              onChange={onTitleChange}
              ref={inputRef}
              onBlur={({ relatedTarget }) => {
                if (relatedTarget?.id !== 'rename-button') {
                  setInEditMode(false)
                  setNewTitle(projectTitle)
                }
              }}
            />
          </span>
          <div className="flex items-center h-full">
            <button
              className="ml-4 flex p-px px-2 gap-2 bg-ch-purple-400 bg-opacity-30 hover:bg-opacity-80 rounded-sm border border-ch-purple-400"
              id="rename-button"
              onClick={() =>
                updateProject({ variables: { id, input: { title: newTitle } } })
              }
            >
              <Svg
                name="check"
                className="w-6 h-6 text-ch-purple-500"
                strokeWidth={3}
              />
              <span>Rename</span>
            </button>
          </div>
        </>
      )}
    </>
  )
}

export default EditableProjectTitle
