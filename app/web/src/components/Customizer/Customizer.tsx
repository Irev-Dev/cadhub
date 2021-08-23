import { useRender } from 'src/components/IdeWrapper/useRender'
import { useIdeContext } from 'src/helpers/hooks/useIdeContext'
import { Switch } from '@headlessui/react'
import Svg from 'src/components/Svg/Svg'
import {
  CadhubStringParam,
  CadhubBooleanParam,
  CadhubNumberParam,
} from './customizerConverter'

const Customizer = () => {
  const [open, setOpen] = React.useState(false)
  const [shouldLiveUpdate, setShouldLiveUpdate] = React.useState(false)
  const { state, thunkDispatch } = useIdeContext()
  const customizerParams = state?.customizerParams
  const currentParameters = state?.currentParameters || {}
  const handleRender = useRender()

  const updateCustomizerParam = (paramName: string, paramValue: any) => {
    const payload = {
      ...currentParameters,
      [paramName]: paramValue,
    }
    thunkDispatch({ type: 'setCurrentCustomizerParams', payload })
    shouldLiveUpdate && setTimeout(() => handleRender())
  }
  if (!customizerParams?.length) return null
  return (
    <div
      className={`absolute inset-x-0 bottom-0 bg-ch-gray-600 bg-opacity-60 text-ch-gray-300 text-lg font-fira-sans ${
        open ? 'h-1/3' : ''
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
      <div className={`${open ? 'h-full pb-32' : 'h-0'} overflow-y-auto px-12`}>
        <div>
          {customizerParams.map((param, index) => {
            const otherProps = {
              value: currentParameters[param.name],
              onChange: (value) => updateCustomizerParam(param.name, value),
            }
            if (param.type === 'string') {
              return <StringParam key={index} param={param} {...otherProps} />
            } else if (param.type === 'number') {
              return <NumberParam key={index} param={param} {...otherProps} />
            } else if (param.type === 'boolean') {
              return <BooleanParam key={index} param={param} {...otherProps} />
            }
            return <div key={index}>{JSON.stringify(param)}</div>
          })}
        </div>
      </div>
    </div>
  )
}

export default Customizer

function CustomizerParamBase({
  name,
  caption,
  children,
}: {
  name: string
  caption: string
  children: React.ReactNode
}) {
  return (
    <li
      className="grid items-center my-2"
      style={{ gridTemplateColumns: 'auto 8rem' }}
    >
      <div className=" text-sm font-fira-sans">
        <div className="font-bold text-base">{name}</div>
        <div>{caption}</div>
      </div>
      <div className="w-full">{children}</div>
    </li>
  )
}

function BooleanParam({
  param,
  value,
  onChange,
}: {
  param: CadhubBooleanParam
  value: any
  onChange: Function
}) {
  return (
    <CustomizerParamBase name={param.name} caption={param.caption}>
      <Switch
        checked={value}
        onChange={(newValue) => {
          onChange(newValue)
        }}
        className={`${
          value ? 'bg-ch-gray-300' : 'bg-ch-gray-600'
        } relative inline-flex items-center h-6 rounded-full w-11 mr-6 border border-ch-gray-300`}
      >
        <span
          className={`${
            value ? 'translate-x-6' : 'translate-x-1'
          } inline-block w-4 h-4 transform bg-white rounded-full`}
        />
      </Switch>
    </CustomizerParamBase>
  )
}

function StringParam({
  param,
  value,
  onChange,
}: {
  param: CadhubStringParam
  value: any
  onChange: Function
}) {
  return (
    <CustomizerParamBase name={param.name} caption={param.caption}>
      <input
        className="bg-transparent h-8 border border-ch-gray-300 px-2 text-sm w-full"
        type="text"
        value={value}
        placeholder={param.placeholder}
        onChange={({ target }) => onChange(target?.value)}
      />
    </CustomizerParamBase>
  )
}

function NumberParam({
  param,
  value,
  onChange,
}: {
  param: CadhubNumberParam
  value: any
  onChange: Function
}) {
  const [isFocused, isFocusedSetter] = React.useState(false)
  const [localValue, localValueSetter] = React.useState(0)
  const [isLocked, isLockedSetter] = React.useState(false)
  const [pixelsDragged, pixelsDraggedSetter] = React.useState(0)
  const step = param.step || 1
  const commitChange = () => {
    let num = localValue
    if (typeof param.step === 'number') {
      num = Math.round(num / step) * step
    }
    if (typeof param.min === 'number') {
      num = Math.max(param.min, num)
    }
    if (typeof param.max === 'number') {
      num = Math.min(param.max, num)
    }
    num = Number(num.toFixed(2))
    localValueSetter(num)
    onChange(num)
  }
  React.useEffect(() => {
    if (!isFocused) commitChange()
  }, [isFocused])
  React.useEffect(() => localValueSetter(value), [value])
  return (
    <CustomizerParamBase name={param.name} caption={param.caption}>
      <div className="flex h-8 border border-ch-gray-300">
        <input
          className={`bg-transparent px-2 text-sm w-full ${
            (param.max && param.max < localValue) ||
            (param.min && param.min > localValue)
              ? 'text-red-500'
              : ''
          }`}
          type="number"
          value={localValue}
          onFocus={() => isFocusedSetter(true)}
          onBlur={() => isFocusedSetter(false)}
          onKeyDown={({ key }) => key === 'Enter' && commitChange()}
          onChange={({ target }) => {
            const num = Number(target?.value)
            localValueSetter(num)
          }}
          max={param.max}
          min={param.min}
          step={step}
        />
        <div
          className="w-6 border-l border-ch-gray-500 items-center hidden md:flex"
          style={{ cursor: 'ew-resize' }}
          onMouseDown={({ target }) => {
            isLockedSetter(true)
            target?.requestPointerLock?.()
            pixelsDraggedSetter(localValue)
          }}
          onMouseUp={() => {
            isLockedSetter(false)
            document?.exitPointerLock?.()
            commitChange()
          }}
          onMouseMove={({ movementX }) => {
            if (isLocked && movementX) {
              pixelsDraggedSetter(pixelsDragged + (movementX * step) / 8) // one step per 8 pixels
              localValueSetter(Number(pixelsDragged.toFixed(2)))
            }
          }}
        >
          <Svg className="w-6" name="switch-horizontal" />
        </div>
      </div>
    </CustomizerParamBase>
  )
}
