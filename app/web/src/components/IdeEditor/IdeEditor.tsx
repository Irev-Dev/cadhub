import { useEffect, useState } from 'react'
import { useIdeContext } from 'src/helpers/hooks/useIdeContext'
import { makeCodeStoreKey, requestRender } from 'src/helpers/hooks/useIdeState'
import Editor, { useMonaco } from '@monaco-editor/react'
import { theme } from 'src/../tailwind.config'
import { useSaveCode } from 'src/components/IdeWrapper/useSaveCode'
import type { CadPackage as CadPackageType } from 'src/helpers/hooks/useIdeState'
import CadPackage from '../CadPackage/CadPackage'

const colors = theme.extend.colors

const IdeEditor = ({ Loading }) => {
  const { state, thunkDispatch } = useIdeContext()
  const [theme, setTheme] = useState('vs-dark')
  const saveCode = useSaveCode()

  const ideTypeToLanguageMap: { [key in CadPackageType]: string } = {
    cadquery: 'python',
    openscad: 'cpp',
    jscad: 'javascript',
  }
  const monaco = useMonaco()
  useEffect(() => {
    if (monaco) {
      const themeName = 'cadhub'
      monaco.editor.defineTheme(themeName, {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { background: colors['ch-gray'][750] },
          {
            token: 'comment',
            foreground: colors['ch-blue'][600],
            fontStyle: 'italic',
          },
          { token: 'keyword', foreground: colors['ch-purple'][600] },
          { token: 'string', foreground: colors['ch-pink'][300] },
        ],
        colors: {
          'editor.background': colors['ch-gray'][800],
        },
      })
      setTheme(themeName)
    }
  }, [monaco])

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
        saveCode({ code: state.code })
        requestRender({
          state,
          dispatch,
          code: state.code,
          viewerSize: state.viewerSize,
          camera: state.camera,
          parameters: state.currentParameters,
        })
      })
      localStorage.setItem(makeCodeStoreKey(state.ideType), state.code)
    }
  }

  return (
    <div // eslint-disable-line jsx-a11y/no-static-element-interactions
      className="h-full"
      onKeyDown={handleSaveHotkey}
    >
      <Editor
        defaultValue={state.code}
        value={state.code}
        theme={theme}
        loading={Loading}
        // TODO #247 cpp seems better than js for the time being
        defaultLanguage={ideTypeToLanguageMap[state.ideType] || 'cpp'}
        language={ideTypeToLanguageMap[state.ideType] || 'cpp'}
        onChange={handleCodeChange}
      />
    </div>
  )
}

export default IdeEditor
