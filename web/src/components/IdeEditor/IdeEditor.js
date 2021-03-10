import { useContext } from 'react'
import { IdeContext } from 'src/components/IdeToolbarNew'
import Editor from '@monaco-editor/react'

const IdeEditor = () => {
  const { state, dispatch } = useContext(IdeContext)

  function handleCodeChange(value, _event) {
    dispatch({ type: 'updateCode', payload: value })
  }

  return (
    <Editor
      defaultValue={state.code}
      defaultLanguage="javascript"
      onChange={handleCodeChange}
    />
  )
}

export default IdeEditor
