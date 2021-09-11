import { ReactNode, useState } from 'react'
import { Link, routes } from '@redwoodjs/router'
import { Tab } from '@headlessui/react'
import Svg, { SvgNames } from 'src/components/Svg/Svg'

interface SidebarConfigType {
  name: string,
  icon: SvgNames,
  disabled: boolean,
  panel: ReactNode | null,
}

const sidebarTopConfig : SidebarConfigType[] = [
  {
    name: 'Files',
    icon: 'files',
    disabled: false,
    panel: <h2>Some Files!</h2>,
  },
  {
    name: 'GitHub',
    icon: 'github',
    disabled: false,
    panel: <h2>Le GitHub Integration™️</h2>,
  },
  {
    name: 'Visibility',
    icon: 'eye',
    disabled: true,
    panel: null,
  },
]

const sidebarBottomConfig : SidebarConfigType[] = [
  {
    name: 'Settings',
    icon: 'gear',
    disabled: true,
    panel: null,
  },
]

const combinedConfig = [
  ...sidebarTopConfig,
  ...sidebarBottomConfig,
]

function TabToggle({ item, className = "", active, onChange, onClick }) {
  return (
  <label
    key={'tab-'+item.name}
    className={`tabToggle${item.disabled ? ' disabled' : ''}${active ? ' active' : ''} ${className}`}>
    <input name="sidebar-tabs"
      type="radio"
      disabled={item.disabled}
      value={ item.name }
      onChange={ onChange }
      onClick={ onClick }
      className="visually-hidden"
    />
    <Svg name={item.icon} className="w-8 mx-auto"/>
  </label>
  )
}

const IdeSideBar = () => {
  const [selectedTab, setSelectedTab] = useState("")
  const [lastOpen, setLastOpen] = useState("")

  function onTabClick(name) {
    return function() {
      if (selectedTab === name) {
        setLastOpen(selectedTab)
        setSelectedTab("")
      } else if (selectedTab === "" && lastOpen === name) {
        setSelectedTab(name)
      }
    }
  }

  return (
    <section className="flex h-full bg-ch-gray-700">
      <fieldset className="h-full flex flex-col justify-between border-r-2 border-ch-gray-900">
        <div>
          { sidebarTopConfig.map((topItem, i) => (
            <TabToggle
              item={topItem}
              active={ selectedTab === topItem.name }
              onChange={ () => setSelectedTab(topItem.name) }
              onClick={ onTabClick(topItem.name) }
            />
          ))}
        </div>
        <div>
          { sidebarBottomConfig.map((bottomItem, i) => (
            <TabToggle
            item={bottomItem}
            active={ selectedTab === bottomItem.name }
            onChange={ () => setSelectedTab(bottomItem.name) }
            onClick={ onTabClick(bottomItem.name) }
          />
          ))}
        </div>
      </fieldset>
      { combinedConfig.find(item => item.name === selectedTab)?.panel && (
        <div className="w-56 h-full bg-ch-gray-700 py-4 px-2 text-ch-gray-300 border-t-2 border-ch-gray-900">
          { combinedConfig.find(item => item.name === selectedTab).panel }
        </div>
      ) }
    </section>
  )
}

export default IdeSideBar
