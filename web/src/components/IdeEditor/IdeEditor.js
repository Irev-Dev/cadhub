import { useContext, useEffect } from 'react'
import { isBrowser } from '@redwoodjs/prerender/browserUtils'
import { IdeContext } from 'src/components/IdeToolbarNew'
import Editor from '@monaco-editor/react'

const IdeEditor = () => {
  const { state, dispatch } = useContext(IdeContext)

  const scriptKey = 'encoded_script'
  useEffect(() => {
    // load code from hash if it's there
    let hash
    if (isBrowser) {
      hash = window.location.hash
    }
    const [key, scriptBase64] = hash.slice(1).split('=')
    if (key === scriptKey) {
      const script = atob(scriptBase64)
      dispatch({ type: 'updateCode', payload: script })
    }
  }, [])
  useEffect(() => {
    if (isBrowser) {
      window.location.hash = ''
    }
  }, [state.code])

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
