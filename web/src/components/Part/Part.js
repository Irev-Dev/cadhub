import { useMutation, useFlash } from '@redwoodjs/web'
import { Link, routes, navigate } from '@redwoodjs/router'
import { initialize } from 'src/cascade/js/MainPage/CascadeMain'
import { useEffect, useState } from 'react'

const DELETE_PART_MUTATION = gql`
  mutation DeletePartMutation($id: Int!) {
    deletePart(id: $id) {
      id
    }
  }
`

const Part = ({ part, saveCode, loading, error}) => {
  const [code, setCode] = useState(part.code)
  useEffect(() => {
    const sickCallback = (code) => setCode(code)
    initialize(sickCallback, part.code)
  }, [])
  const hasChanges = code !== part.code
  const { addMessage } = useFlash()
  const [deletePart] = useMutation(DELETE_PART_MUTATION, {
    onCompleted: () => {
      navigate(routes.parts())
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
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Part {part.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Title</th>
              <td>{part.title}</td>
            </tr>
            <tr>
              <th>Description</th>
              <td>{part.description}</td>
            </tr>
            {/* <tr>
              <th>Code</th>
              <td>{part.code}</td>
            </tr> */}
            {/* <tr>
              <th>Main image</th>
              <td>{part.mainImage}</td>
            </tr> */}
            {/* <tr>
              <th>Created at</th>
              <td>{timeTag(part.createdAt)}</td>
            </tr> */}
          </tbody>
        </table>
        <img src={part.mainImage} />
      </div>
      <nav className="rw-button-group">
        {loading && 'Loading...'}
        {hasChanges && !loading && <button onClick={() => saveCode({code}, part.id)} className="rw-button rw-button-blue">
          Save Changes
        </button>}
      </nav>
      <div>
        <div id="topnav" className="topnav">
            <a href="https://github.com/zalo/CascadeStudio">Cascade Studio 0.0.6</a>
            <a href="#" id="main-proj-button" title="Sets this project to save in local storage." onClick={() => makeMainProject()}>Make Main Project</a>
            <a href="#" title="Save Project to .json" onClick={() => saveProject()}>Save Project</a>
            <label htmlFor="project-file" title="Load Project from .json">Load Project
                <input
                  id="project-file"
                  name="project-file"
                  type="file"
                  accept=".json"
                  style={{display:'none'}}
                  onInput={() => loadProject()}
                />
            </label>
            <a href="#" onClick={() => threejsViewport.saveShapeSTEP()}>Save STEP</a>
            <a href="#" onClick={() => threejsViewport.saveShapeSTL()}>Save STL</a>
            <a href="#" onClick={() => threejsViewport.saveShapeOBJ()}>Save OBJ</a>
            <label htmlFor="files" title="Import STEP, IGES, or (ASCII) STL from File">Import STEP/IGES/STL
                <input id="files" name="files" type="file" accept=".iges,.step,.igs,.stp,.stl" multiple style={{display: 'none'}} onInput={ () =>loadFiles()}/>
            </label>
            <a href="#" title="Clears the external step/iges/stl files stored in the project." onClick={() => clearExternalFiles()}>Clear Imported Files</a>
            <a href="" title="Resets the project and localstorage." onClick={() => {
              window.localStorage.clear();
              window.history.replaceState({}, 'Cascade Studio','?')
            }}>Reset Project</a>
        </div>
        <div id="cascade-container" style={{height:'auto'}}>
        </div>
        <footer>footer</footer>
      </div>
    </>
  )
}

export default Part
