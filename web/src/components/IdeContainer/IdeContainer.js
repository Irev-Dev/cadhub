import IdeEditor from 'src/components/IdeEditor'
import IdeViewer from 'src/components/IdeViewer'
import IdeConsole from 'src/components/IdeConsole'

const IdeContainer = () => {
  return (
    <div className="p-8 border-2">
      <h2>hi I'm IDE container</h2>
      <div className="flex">
        <IdeEditor />
        <IdeViewer />
        <IdeConsole />
      </div>
    </div>
  )
}

export default IdeContainer
