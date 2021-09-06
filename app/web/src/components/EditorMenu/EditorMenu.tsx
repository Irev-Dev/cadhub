import { Menu } from '@headlessui/react'
import { useHotkeys } from 'react-hotkeys-hook';
import { useIdeContext } from 'src/helpers/hooks/useIdeContext'
import Svg from 'src/components/Svg/Svg'
import { useRender } from 'src/components/IdeWrapper/useRender'
import { makeStlDownloadHandler, PullTitleFromFirstLine } from './helpers'
import { useSaveCode } from 'src/components/IdeWrapper/useSaveCode'
import CadPackage from 'src/components/CadPackage/CadPackage'
import { EditorMenuConfig, EditorMenuItemConfig, editorMenuConfig } from './menuConfig'
import AllShortcutsModal from './AllShortcutsModal'

const EditorMenu = () => {
  const handleRender = useRender()
  const saveCode = useSaveCode()
  const { state, thunkDispatch } = useIdeContext()
  const handleStlDownload = makeStlDownloadHandler({
    type: state.objectData?.type,
    ideType: state.ideType,
    geometry: state.objectData?.data,
    quality: state.objectData?.quality,
    fileName: PullTitleFromFirstLine(state.code || ''),
    thunkDispatch,
  })

  editorMenuConfig.forEach(menu => 
    menu.items.forEach(({shortcut, callback}) => 
      useHotkeys(shortcut, callback), [state])
  )
  
  return (<>
    <div className="flex justify-between bg-ch-gray-760 text-gray-100">
      <div className="flex items-center h-9 w-full cursor-grab">
        <div className=" text-ch-gray-760 bg-ch-gray-300 cursor-grab px-2 h-full flex items-center">
          <Svg name="drag-grid" className="w-4 p-px" />
        </div>
        <div className="grid grid-flow-col-dense gap-6 px-5">
          { editorMenuConfig.map(menu => (
            <Dropdown label={menu.label} disabled={menu.disabled} key={menu.label +"-dropdown"}>
              { menu.items.map(itemConfig => (
                <DropdownItem config={itemConfig} key={ menu.label +"-"+ itemConfig.label} />)
              ) }
            </Dropdown>
          )) }
        </div>
        <button
          className="text-ch-gray-300  h-full cursor-not-allowed"
          aria-label="editor settings"
          disabled
        >
          <Svg name="gear" className="w-6 p-px" />
        </button>
      </div>
      <CadPackage cadPackage={state.ideType} className="px-3" />
    </div>
    <AllShortcutsModal/>
  </>)
}

export default EditorMenu

function DropdownItem({ config }) {
  return (
    <Menu.Item>
      {({ active }) => (
      <button
        className={`${active && 'bg-gray-600'} px-2 py-1 text-left`}
        onClick={config.callback}
      >
        {config.label}
        {config.shortcutLabel && <span className="text-gray-400 pl-4">{ config.shortcutLabel }</span> }
      </button>
    )}
    </Menu.Item>
  )
}

function Dropdown({
  label,
  disabled,
  children,
}: {
  label: string,
  disabled: boolean,
  children: React.ReactNode,
}) {
  return (
    <div className="relative">
      <Menu>
        <Menu.Button className={"text-gray-100" + (disabled ? " text-gray-400 cursor-not-allowed" : "")} disabled={disabled}>{label}</Menu.Button>
        { children &&
        <Menu.Items className="absolute flex flex-col mt-4 bg-ch-gray-760 rounded text-gray-100 overflow-hidden whitespace-nowrap border border-ch-gray-700">
          {children}
        </Menu.Items>
        }
      </Menu>
    </div>
  )
}
