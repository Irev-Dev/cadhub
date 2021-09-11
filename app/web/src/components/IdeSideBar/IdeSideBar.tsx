import { useState } from 'react'
import Svg from 'src/components/Svg/Svg'
import { sidebarTopConfig, sidebarBottomConfig, sidebarCombinedConfig } from './sidebarConfig'

function TabToggle({ item, className = "", active, onChange, onClick }) {
  return (
  <label
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
    <section className="flex h-full bg-ch-gray-900">
      <fieldset className="h-full flex flex-col justify-between bg-ch-gray-700">
        <div>
          { sidebarTopConfig.map((topItem, i) => (
            <TabToggle
              item={topItem}
              active={ selectedTab === topItem.name }
              onChange={ () => setSelectedTab(topItem.name) }
              onClick={ onTabClick(topItem.name) }
              key={ 'tab-' + i }
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
            key={ 'tab-' + (sidebarTopConfig.length+i) }
          />
          ))}
        </div>
      </fieldset>
      { sidebarCombinedConfig.find(item => item.name === selectedTab)?.panel && (
        <div className="w-56 bg-ch-gray-900 text-ch-gray-300 border border-ch-pink-800 border-opacity-30" style={{ height: 'calc(100% - 6px)', margin: '3px'}}>
          <h2 className="flex items-center h-9 px-4 bg-ch-pink-800 bg-opacity-30">{ selectedTab }</h2>
          { sidebarCombinedConfig.find(item => item.name === selectedTab).panel }
        </div>
      ) }
    </section>
  )
}

export default IdeSideBar
