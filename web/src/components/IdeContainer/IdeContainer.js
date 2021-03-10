import { useContext } from 'react'
import { Mosaic, MosaicWindow } from 'react-mosaic-component'
import { IdeContext } from 'src/components/IdeToolbarNew'
import IdeEditor from 'src/components/IdeEditor'
import IdeViewer from 'src/components/IdeViewer'
import IdeConsole from 'src/components/IdeConsole'
import 'react-mosaic-component/react-mosaic-component.css'

const ELEMENT_MAP = {
  Editor: <IdeEditor/>,
  Viewer: <IdeViewer/>,
  Console: <IdeConsole/>,
}

const IdeContainer = () => {
  const { state, dispatch } = useContext(IdeContext)

  return (<div id='cadhub-ide' className='h-screen'>
    <Mosaic
      renderTile={ (id, path) => (
        <MosaicWindow path={path} title={id} className={id.toLowerCase()}>
          { ELEMENT_MAP[id] }
        </MosaicWindow>
      )}
      value={state.layout}
      onChange={newLayout => dispatch({ type: 'updateLayout', payload: { message: newLayout } })}
    />
  </div>)
}

export default IdeContainer