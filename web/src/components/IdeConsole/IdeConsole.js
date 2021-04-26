import { useContext, useEffect } from 'react'
import { IdeContext } from 'src/components/IdeToolbarNew'

const IdeConsole = () => {
  const { state } = useContext(IdeContext)
  useEffect(() => {
    const element = document.querySelector('.console-tile .mosaic-window-body')
    if (element) {
      element.scrollTop = element.scrollHeight - element.clientHeight
    }
  }, [state.consoleMessages])
  const matchEditorVsDarkThemeBg = { backgroundColor: 'rgb(30,30,30)' }
  const matchEditorVsDarkThemeText = { color: 'rgb(212,212,212)' }
  const matchEditorVsDarkThemeTextBrown = { color: 'rgb(206,144,120)' }
  return (
    <div className="p-2 px-4 min-h-full" style={matchEditorVsDarkThemeBg}>
      <div>
        {state.consoleMessages?.map(({ type, message, time }, index) => (
          <pre
            className="font-mono text-sm"
            style={matchEditorVsDarkThemeText}
            key={message + index}
          >
            <div
              className="text-xs font-bold pt-2"
              style={matchEditorVsDarkThemeTextBrown}
            >
              {time?.toLocaleString()}
            </div>
            <div className={(type === 'error' ? 'text-red-400' : '') + ' pl-4'}>
              {message}
            </div>
          </pre>
        ))}
      </div>
    </div>
  )
}

export default IdeConsole
