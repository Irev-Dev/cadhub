import { useContext } from 'react'
import { IdeContext } from 'src/components/IdeToolbarNew'

const IdeEditor = () => {
  const { state, dispatch } = useContext(IdeContext)
  return (
    <div className="p-8 border-2 m-2">
      <div>hi I'm editor</div>
      <div className="pb-2">code:</div>
      <input
        value={state.code}
        className="font-mono"
        onChange={({ target }) =>
          dispatch({ type: 'updateCode', payload: target.value })
        }
      />
      <button
        onClick={() =>
          dispatch({ type: 'render', payload: { code: state.code } })
        }
        className="m-2 border-2 shadow-md p-2 rounded"
      >
        Render plz
      </button>
    </div>
  )
}

export default IdeEditor
