import { useMutation, useFlash } from '@redwoodjs/web'
import { Link, routes, navigate } from '@redwoodjs/router'
import { initialize } from 'src/cascade/js/MainPage/CascadeMain'
import CascadeController from 'src/helpers/cascadeController'
import { useEffect, useState } from 'react'

const DELETE_PART_MUTATION = gql`
  mutation DeletePartMutation($id: Int!) {
    deletePart(id: $id) {
      id
    }
  }
`
const domNode = document.createElement('div').setAttribute('id', 'sickId')

const IdeCascadeStudio = ({ part, saveCode, loading, error }) => {
  const [code, setCode] = useState(part.code)
  useEffect(() => {
    const onCodeChange = (code) => setCode(code)
    CascadeController.initialise(onCodeChange, part.code, domNode)
    const element = document.getElementById('cascade-container')
    element.setAttribute('style', 'height: auto; display: block; opacity: 100%') // eslint-disable-line
    return () => {
      element.setAttribute('style', 'height: auto; display: none;') // eslint-disable-line
    }
  }, [])
  const hasChanges = code !== part.code
  const { addMessage } = useFlash()
  const [deletePart] = useMutation(DELETE_PART_MUTATION, {
    onCompleted: () => {
      // navigate(routes.parts())
      addMessage('Part deleted.', { classes: 'rw-flash-success' })
    },
  })

  const onDeleteClick = (id) => {
    if (confirm('Are you sure you want to delete part ' + id + '?')) {
      deletePart({ variables: { id } })
    }
  }

  return (
    <>
      <nav className="rw-button-group">
        {loading && 'Loading...'}
        {hasChanges && !loading && (
          <button
            onClick={() => saveCode({ code }, part.id)}
            className="rw-button rw-button-blue"
          >
            Save Changes
          </button>
        )}
      </nav>
      <div>
        <div id="topnav" className="topnav">
          <a href="https://github.com/zalo/CascadeStudio">
            Cascade Studio 0.0.6
          </a>
          <a
            href="#"
            id="main-proj-button"
            title="Sets this project to save in local storage."
            onClick={() => makeMainProject()}
          >
            Make Main Project
          </a>
          <a
            href="#"
            title="Save Project to .json"
            onClick={() => saveProject()}
          >
            Save Project
          </a>
          <label htmlFor="project-file" title="Load Project from .json">
            Load Project
            <input
              id="project-file"
              name="project-file"
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onInput={() => loadProject()}
            />
          </label>
          <a href="#" onClick={() => threejsViewport.saveShapeSTEP()}>
            Save STEP
          </a>
          <a href="#" onClick={() => threejsViewport.saveShapeSTL()}>
            Save STL
          </a>
          <a href="#" onClick={() => threejsViewport.saveShapeOBJ()}>
            Save OBJ
          </a>
          <label
            htmlFor="files"
            title="Import STEP, IGES, or (ASCII) STL from File"
          >
            Import STEP/IGES/STL
            <input
              id="files"
              name="files"
              type="file"
              accept=".iges,.step,.igs,.stp,.stl"
              multiple
              style={{ display: 'none' }}
              onInput={() => loadFiles()}
            />
          </label>
          <a
            href="#"
            title="Clears the external step/iges/stl files stored in the project."
            onClick={() => clearExternalFiles()}
          >
            Clear Imported Files
          </a>
          <a
            href=""
            title="Resets the project and localstorage."
            onClick={() => {
              window.localStorage.clear()
              window.history.replaceState({}, 'Cascade Studio', '?')
            }}
          >
            Reset Project
          </a>
        </div>
        {/* <div
          id="cascade-container"
          style={{ height: 'auto' }}
          // dangerouslySetInnerHTML={domNode}
        ></div> */}
      </div>
    </>
  )
}

export default IdeCascadeStudio
