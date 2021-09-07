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
            className="font-mono text-sm text-gray-400"
            key={`${message} ${index}`}
          >
            <div className="text-xs font-bold pt-2 text-ch-blue-400">
              {time?.toLocaleString()}
            </div>
            <div className={(type === 'error' ? 'text-red-400' : '') + ' pl-4'}>
              {(message || '').split('\n').map((line, index) => {
                return (
                  <div key={index}>
                    {line.startsWith('ECHO:') ? (
                      <span className="text-xs">
                        ECHO:{' '}
                        <span className="text-purple-300 font-semibold text-base">
                          {line.slice(6)}
                        </span>
                      </span>
                    ) : (
                      line
                    )}
                  </div>
                )
              })}
            </div>
          </pre>
        ))}
      </div>
    </div>
  )
}

export default IdeConsole
