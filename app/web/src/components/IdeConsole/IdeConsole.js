import { useEffect } from 'react'
import { useIdeContext } from 'src/helpers/hooks/useIdeContext'

const IdeConsole = () => {
  const { state } = useIdeContext()
  useEffect(() => {
    const element = document.querySelector('.console-tile .mosaic-window-body')
    if (element) {
      element.scrollTop = element.scrollHeight - element.clientHeight
    }
  }, [state.consoleMessages])

  return (
    <div className="p-2 px-8 pt-4 min-h-full bg-ch-gray-800">
      <div>
        {state.consoleMessages?.map(({ type, message, time }, index) => (
          <pre
            className="font-mono text-sm text-gray-300"
            key={`${message} ${index}`}
          >
            <div className="text-xs font-bold pt-2 text-ch-blue-600">
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
