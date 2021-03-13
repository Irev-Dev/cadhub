import { useContext } from 'react'
import { IdeContext } from 'src/components/IdeToolbarNew'

const IdeConsole = () => {
  const { state } = useContext(IdeContext)
  return (
    <div className="p-8 border-2 m-2 overflow-y-auto">
      <div>
        {state.consoleMessages?.map(({ type, message }, index) => (
          <div
            className={'font-mono ' + (type === 'error' ? 'text-red-500' : '')}
            key={message + index}
          >
            -> {message}
          </div>
        ))}
      </div>
    </div>
  )
}

export default IdeConsole
