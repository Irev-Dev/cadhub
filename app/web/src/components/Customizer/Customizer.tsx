import { useRender } from 'src/components/IdeWrapper/useRender'
import { useIdeContext } from 'src/helpers/hooks/useIdeContext'

const Customizer = () => {
  const [open, setOpen] = React.useState(true)
  const ref = React.useRef()
  const jsCadCustomizerElement = ref.current
  const { state } = useIdeContext()
  const customizerParams = state?.objectData?.customizerParams
  console.log(state)
  React.useEffect(() => {
    console.log({ jsCadCustomizerElement, customizerParams })
    if (jsCadCustomizerElement && customizerParams) {
      jsCadCustomizerElement.innerHTML = `<div>${JSON.stringify(
        customizerParams
      )}</div>`
    }
  }, [jsCadCustomizerElement, customizerParams])
  const handleRender = useRender()
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
        <button
          className="px-4 py-1 rounded bg-ch-gray-300 text-ch-gray-800"
          onClick={handleRender}
        >
          Update
        </button>
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
