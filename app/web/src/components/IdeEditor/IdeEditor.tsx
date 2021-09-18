import { useEffect, useState } from 'react'
import { useIdeContext } from 'src/helpers/hooks/useIdeContext'
import { makeCodeStoreKey, requestRender } from 'src/helpers/hooks/useIdeState'
import Editor, { useMonaco } from '@monaco-editor/react'
import { theme } from 'src/../config/tailwind.config'
import { useSaveCode } from 'src/components/IdeWrapper/useSaveCode'
import type { CadPackageType } from 'src/components/CadPackage/CadPackage'

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
      { (state.models.length > 1) && (
        <fieldset
          className='bg-ch-gray-700 text-ch-gray-300 flex m-0 p-0'>
          { state.models.map((model, i) => (
            <label key={model.type + '-' + i}
              className={'flex items-center gap-2 px-4 py-1 block m-0 select-none relative bg-ch-gray-600 ' + ((state.currentModel === i) && 'bg-ch-gray-800')}>
              { model.label }
              <input
                type='radio'
                name='models'
                className='sr-only absolute inset-0'
                value={i}
                checked={state.currentModel === i}
                onChange={() => thunkDispatch({ type: 'switchEditorModel', payload: i })} />
            { (model.type !== 'code') && 
              <button onClick={() => thunkDispatch({ type: 'removeEditorModel', payload: i })}
                className='block p-1 m-.5 hover:bg-ch-gray-550' >
                <svg viewBox='0 0 5 5' className='w-4 text-ch-gray-300'>
                  <path stroke='currentColor' d='M 1 1 l 3 3 M 1 4 l 3 -3' strokeLinecap='round' strokeWidth='.5' />
                </svg>
              </button>
            }
            </label>
          )) }
        </fieldset>
      )}
      { (state.models[state.currentModel].type === 'code') 
        ? <Editor
          defaultValue={state.code}
          value={state.code}
          theme={theme}
          loading={Loading}
          // TODO #247 cpp seems better than js for the time being
          defaultLanguage={ideTypeToLanguageMap[state.ideType] || 'cpp'}
          language={ideTypeToLanguageMap[state.ideType] || 'cpp'}
          onChange={handleCodeChange}
        />
        : <pre className="bg-ch-gray-800 text-ch-gray-300 p-6 h-full">{ state.models[state.currentModel].content }</pre>
      }
    </div>
  )
}

export default IdeEditor
