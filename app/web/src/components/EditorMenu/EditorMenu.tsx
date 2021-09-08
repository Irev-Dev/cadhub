import { useIdeContext } from 'src/helpers/hooks/useIdeContext'
import Svg from 'src/components/Svg/Svg'
import CadPackage from 'src/components/CadPackage/CadPackage'
import { editorMenuConfig } from './menuConfig'
import AllShortcutsModal from './AllShortcutsModal'
import { Dropdown } from './Dropdowns'

const EditorMenu = () => {
  const { state, thunkDispatch } = useIdeContext()

  return (
    <>
      <div className="flex justify-between bg-ch-gray-760 text-gray-100">
        <div className="flex items-center h-9 w-full cursor-grab">
          <div className=" text-ch-gray-760 bg-ch-gray-300 cursor-grab px-2 h-full flex items-center">
            <Svg name="drag-grid" className="w-4 p-px" />
          </div>
          <div className="grid grid-flow-col-dense gap-6 px-5">
            {editorMenuConfig.map((menu) => (
              <Dropdown
                label={menu.label}
                disabled={menu.disabled}
                key={menu.label + '-dropdown'}
              >
                {menu.items.map((itemConfig) => (
                  <itemConfig.component
                    state={state}
                    thunkDispatch={thunkDispatch}
                    config={itemConfig}
                    key={menu.label + '-' + itemConfig.label}
                  />
                ))}
              </Dropdown>
            ))}
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
      <AllShortcutsModal />
    </>
  )
}

export default EditorMenu
