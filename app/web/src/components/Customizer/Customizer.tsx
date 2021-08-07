import { useRender } from 'src/components/IdeWrapper/useRender'
import { useIdeContext } from 'src/helpers/hooks/useIdeContext'
import { genParams } from 'src/helpers/cadPackages/jsCad/jscadParams'

const Customizer = () => {
  const [open, setOpen] = React.useState(true)
  const [checked, setChecked] = React.useState(false)
  const ref = React.useRef()
  const jsCadCustomizerElement = ref.current
  const { state, thunkDispatch } = useIdeContext()
  const customizerParams = state?.customizerParams
  const currentParameters = state?.currentParameters
  const handleRender = useRender()

  React.useEffect(() => {
    if (jsCadCustomizerElement && customizerParams) {
      genParams(
        customizerParams,
        jsCadCustomizerElement,
        currentParameters || {},
        (values, source) => {
          thunkDispatch({ type: 'setCurrentCustomizerParams', payload: values })
          if (checked) {
            handleRender()
          }
        },
        []
      )
    }
  }, [jsCadCustomizerElement, customizerParams, currentParameters, checked])
  return (
    <div
      className={`absolute inset-x-0 bottom-0 bg-ch-gray-600 bg-opacity-60 text-ch-gray-300 text-lg font-fira-sans ${
        open ? 'h-2/3' : ''
      }`}
    >
      <div className="flex justify-between px-6 py-2 items-center">
        <div className="flex gap-6 items-center">
          <button className="px-2" onClick={() => setOpen(!open)}>
            {open ? '⬇' : '⬆'}
          </button>
          <div>Parameters</div>
        </div>
        <div className="flex items-center">
          <input
            className="mr-6"
            type="checkbox"
            checked={checked}
            onChange={() => {
              const newValue = !checked
              if (newValue) handleRender()
              setChecked(newValue)
            }}
          />
          <button
            className="px-4 py-1 rounded bg-ch-gray-300 text-ch-gray-800"
            onClick={handleRender}
          >
            Update
          </button>
        </div>
      </div>
      <div className={`${open ? 'h-full' : 'h-0'} overflow-y-auto px-12`}>
        <div
          id="jscad-customizer-block"
          ref={ref}
          // JSCAD param UI injected here.
        />
      </div>
    </div>
  )
}

export default Customizer
