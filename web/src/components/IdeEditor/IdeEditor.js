import { useContext } from 'react'
import { IdeContext } from 'src/components/IdeToolbarNew'
import Editor from '@monaco-editor/react'

const IdeEditor = () => {
  const { state, dispatch } = useContext(IdeContext)

  function handleCodeChange(value, _event) {
    dispatch({ type: 'updateCode', payload: value })
  }
  function handleSaveHotkey(event) {
    //ctrl|meta + s is very intuitive for most devs
    const { key, ctrlKey, metaKey } = event
    if (key === 's' && (ctrlKey || metaKey)) {
      event.preventDefault()
      dispatch({ type: 'render', payload: { code: state.code } })
    }
  }

  return (
    <div className="h-full" onKeyDown={handleSaveHotkey}>
      <Editor
        defaultValue={state.code}
        // TODO #247 cpp seems better than js for the time being
        defaultLanguage="cpp"
        onChange={handleCodeChange}
      />
    </div>
  )
}

export default IdeEditor
