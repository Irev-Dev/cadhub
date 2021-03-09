import IdeEditor from 'src/components/IdeEditor'
import IdeViewer from 'src/components/IdeViewer'
import IdeConsole from 'src/components/IdeConsole'
import { Mosaic, MosaicWindow } from 'react-mosaic-component'
import 'react-mosaic-component/react-mosaic-component.css'

const ELEMENT_MAP = {
  Editor: <IdeEditor/>,
  Viewer: <IdeViewer/>,
  Console: <IdeConsole/>,
}

const IdeContainer = () => {
  return (<div className='h-screen'>
    <Mosaic
      renderTile={ (id, path) => (
        <MosaicWindow path={path} title={id}>
          { ELEMENT_MAP[id] }
        </MosaicWindow>
      )}
      initialValue={{
        direction: 'row',
        first: 'Editor',
        second: {
          direction: 'column',
          first: 'Viewer',
          second: 'Console',
          splitPercentage: 70,
        },
      }}
    />
  </div>)
}

export default IdeContainer
