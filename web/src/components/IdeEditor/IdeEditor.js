import { useContext, useEffect, Suspense, lazy } from 'react'
import { isBrowser } from '@redwoodjs/prerender/browserUtils'
import { IdeContext } from 'src/components/IdeToolbarNew'
import { codeStorageKey } from 'src/helpers/hooks/useIdeState'
import { requestRender } from 'src/helpers/hooks/useIdeState'
const Editor = lazy(() => import('@monaco-editor/react'))

const IdeEditor = () => {
  const { state, thunkDispatch } = useContext(IdeContext)
  const ideTypeToLanguageMap = {
    cadQuery: 'python',
    openScad: 'cpp',
  }

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
      thunkDispatch({ type: 'updateCode', payload: script })
    }
  }, [])
  useEffect(() => {
    if (isBrowser) {
      window.location.hash = ''
    }
  }, [state.code])

  function handleCodeChange(value, _event) {
    thunkDispatch({ type: 'updateCode', payload: value })
  }
  function handleSaveHotkey(event) {
    //ctrl|meta + s is very intuitive for most devs
    const { key, ctrlKey, metaKey } = event
    if (key === 's' && (ctrlKey || metaKey)) {
      event.preventDefault()
      thunkDispatch((dispatch, getState) => {
        const state = getState()
        dispatch({ type: 'setLoading' })
        requestRender({
          state,
          dispatch,
          code: state.code,
          viewerSize: state.viewerSize,
          camera: state.camera,
        })
      })
      localStorage.setItem(codeStorageKey, state.code)
    }
  }
  return (
    <div // eslint-disable-line jsx-a11y/no-static-element-interactions
      className="h-full"
      onKeyDown={handleSaveHotkey}
    >
      <Suspense fallback={<div>. . . loading</div>}>
        <Editor
          defaultValue={state.code}
          // TODO #247 cpp seems better than js for the time being
          defaultLanguage={ideTypeToLanguageMap[state.ideType] || 'cpp'}
          language={ideTypeToLanguageMap[state.ideType] || 'cpp'}
          onChange={handleCodeChange}
        />
      </Suspense>
    </div>
  )
}

export default IdeEditor
