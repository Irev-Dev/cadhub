import { useRender } from 'src/components/IdeWrapper/useRender'
import { useIdeContext } from 'src/helpers/hooks/useIdeContext'
import { genParams } from 'src/helpers/cadPackages/jsCad/jscadParams'
import { Switch } from '@headlessui/react'
import Svg from 'src/components/Svg/Svg'

const Customizer = () => {
  const [open, setOpen] = React.useState(false)
  const [shouldLiveUpdate, setShouldLiveUpdate] = React.useState(false)
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
          if (shouldLiveUpdate) {
            handleRender()
          }
        },
        []
      )
    }
  }, [
    jsCadCustomizerElement,
    customizerParams,
    currentParameters,
    shouldLiveUpdate,
  ])
  if (!state.customizerParams) return null
  return (
    <div
      className={`absolute inset-x-0 bottom-0 bg-ch-gray-600 bg-opacity-60 text-ch-gray-300 text-lg font-fira-sans ${
        open ? 'h-2/3' : ''
      }`}
    >
      <div className="flex justify-between px-6 py-2 items-center">
        <div className="grid grid-flow-col-dense gap-6 items-center">
          <button className="px-2" onClick={() => setOpen(!open)}>
            <Svg
              name="chevron-down"
              className={`h-8 w-8 ${!open && 'transform rotate-180'}`}
            />
          </button>
          <div>Parameters</div>
        </div>
        {open && (
          <>
            <div className="flex items-center">
              <div className="font-fira-sans text-sm mr-4">Auto Update</div>
              <Switch
                checked={shouldLiveUpdate}
                onChange={(newValue) => {
                  setShouldLiveUpdate
                  if (newValue) handleRender()
                  setShouldLiveUpdate(newValue)
                }}
                className={`${
                  shouldLiveUpdate ? 'bg-ch-purple-600' : 'bg-ch-gray-300'
                } relative inline-flex items-center h-6 rounded-full w-11 mr-6`}
              >
                <span
                  className={`${
                    shouldLiveUpdate ? 'translate-x-6' : 'translate-x-1'
                  } inline-block w-4 h-4 transform bg-white rounded-full`}
                />
              </Switch>
              <button
                className={`px-4 py-1 rounded bg-ch-gray-300 text-ch-gray-800 ${
                  shouldLiveUpdate && 'bg-opacity-30 cursor-default'
                }`}
                onClick={handleRender}
                disabled={shouldLiveUpdate}
              >
                Update
              </button>
            </div>
          </>
        )}
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
