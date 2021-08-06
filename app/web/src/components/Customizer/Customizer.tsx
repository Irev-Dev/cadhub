import { useRender } from 'src/components/IdeWrapper/useRender'
import { useIdeContext } from 'src/helpers/hooks/useIdeContext'
import { genParams, getParams } from 'src/helpers/cadPackages/jscadParams'

const Customizer = () => {
  const [open, setOpen] = React.useState(true)
  const [checked, setChecked] = React.useState(false)
  const ref = React.useRef()
  const jsCadCustomizerElement = ref.current
  const { state } = useIdeContext()
  const customizerParams = state?.objectData?.customizerParams
  const lastParameters = state?.objectData?.lastParameters
  const handleRender = useRender()
  const handleRender2 = () => handleRender(getParams(ref.current))

  React.useEffect(() => {
    if (jsCadCustomizerElement && customizerParams) {
      genParams(
        customizerParams,
        jsCadCustomizerElement,
        lastParameters || {},
        (values, source) => {
          if (source === 'group' || !checked) {
            // save to local storage but do not render
            return
          }
          handleRender(values)
        },
        []
      )
    }
  }, [jsCadCustomizerElement, customizerParams, lastParameters, checked])
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
            onChange={({ target }) => {
              const newValue = !checked
              if (newValue) handleRender2()
              setChecked(newValue)
            }}
          />
          <button
            className="px-4 py-1 rounded bg-ch-gray-300 text-ch-gray-800"
            onClick={handleRender2}
          >
            Update
          </button>
        </div>
      </div>
      <div className={`${open ? 'h-full' : 'h-0'} overflow-y-auto py-3 px-12`}>
        <div id="jscad-customizer-block" ref={ref}>
          <p>lots of lines should cause scroll</p>
          <p>lots of lines should cause scroll</p>
          <p>lots of lines should cause scroll</p>
          <p>lots of lines should cause scroll</p>
          <p>lots of lines should cause scroll</p>
          <p>lots of lines should cause scroll</p>
          <p>lots of lines should cause scroll</p>
          <p>lots of lines should cause scroll</p>
          <p>lots of lines should cause scroll</p>
          <p>lots of lines should cause scroll</p>
          <p>lots of lines should cause scroll</p>
          <p>lots of lines should cause scroll</p>
          <p>lots of lines should cause scroll</p>
          <p>lots of lines should cause scroll</p>
          <p>lots of lines should cause scroll</p>
          <p>lots of lines should cause scroll</p>
          <p>lots of lines should cause scroll</p>
          <p>lots of lines should cause scroll</p>
          <p>lots of lines should cause scroll</p>
          <p>lots of lines should cause scroll</p>
          <p>lots of lines should cause scroll</p>
          <p>lots of lines should cause scroll</p>
          <p>lots of lines should cause scroll</p>
          <p>lots of lines should cause scroll</p>
          <p>lots of lines should cause scroll</p>
          <p>lots of lines should cause scroll</p>
          <p>lots of lines should cause scroll</p>
          <p>lots of lines should cause scroll</p>
          <p>lots of lines should cause scroll</p>
          <p>lots of lines should cause scroll</p>
          <p>lots of lines should cause scroll</p>
          <p>lots of lines should cause scroll</p>
          <p>lots of lines should cause scroll</p>
          <p>lots of lines should cause scroll</p>
          <p>lots of lines should cause scroll</p>
          <p>lots of lines should cause scroll</p>
          <p>lots of lines should cause scroll</p>
        </div>
      </div>
    </div>
  )
}

export default Customizer
