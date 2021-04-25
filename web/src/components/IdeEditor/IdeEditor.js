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
          value={state.code}
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
