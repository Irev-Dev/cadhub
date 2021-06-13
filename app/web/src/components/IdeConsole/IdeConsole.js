import { useEffect } from 'react'
import { useIdeContext } from 'src/helpers/hooks/useIdeContext'
import { matchEditorVsDarkTheme } from 'src/components/IdeEditor'

const IdeConsole = () => {
  const { state } = useIdeContext()
  useEffect(() => {
    const element = document.querySelector('.console-tile .mosaic-window-body')
    if (element) {
      element.scrollTop = element.scrollHeight - element.clientHeight
    }
  }, [state.consoleMessages])

  return (
    <div
      className="p-2 px-8 pt-14 min-h-full"
      style={matchEditorVsDarkTheme.Bg}
    >
      <div>
        {state.consoleMessages?.map(({ type, message, time }, index) => (
          <pre
            className="font-mono text-sm"
            style={matchEditorVsDarkTheme.Text}
            key={`${message} ${index}`}
          >
            <div
              className="text-xs font-bold pt-2"
              style={matchEditorVsDarkTheme.TextBrown}
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
