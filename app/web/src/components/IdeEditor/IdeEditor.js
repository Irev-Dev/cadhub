import { useContext, Suspense, lazy } from 'react'
import { IdeContext } from 'src/components/IdeToolbarNew'
import { makeCodeStoreKey } from 'src/helpers/hooks/useIdeState'
import { requestRender } from 'src/helpers/hooks/useIdeState'
const Editor = lazy(() => import('@monaco-editor/react'))

export const matchEditorVsDarkTheme = {
  // Some colors to roughly match the vs-dark editor theme
  Bg: { backgroundColor: 'rgb(30,30,30)' },
  lighterBg: { backgroundColor: 'rgb(55,55,55)' },
  Text: { color: 'rgb(212,212,212)' },
  TextBrown: { color: 'rgb(206,144,120)' },
}

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
      localStorage.setItem(makeCodeStoreKey(state.ideType), state.code)
    }
  }
  const loading = (
    <div
      className="text-gray-700 font-ropa-sans relative"
      style={{ backgroundColor: 'red' }}
    >
      <div className="absolute inset-0 text-center flex items-center w-32">
        . . . loading
      </div>
    </div>
  )
  return (
    <div // eslint-disable-line jsx-a11y/no-static-element-interactions
      className="h-full"
      onKeyDown={handleSaveHotkey}
    >
      <Suspense fallback={loading}>
        <Editor
          defaultValue={state.code}
          value={state.code}
          theme="vs-dark"
          loading={loading}
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
