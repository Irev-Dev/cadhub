import { Link, routes } from '@redwoodjs/router'
import { Tab } from '@headlessui/react'
import Svg, { SvgNames } from 'src/components/Svg/Svg'
import { ReactNode } from 'react'

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
    panel: () => { <h2>Some Files!</h2> },
  },
  {
    name: 'GitHub',
    icon: 'github',
    disabled: false,
    panel: () => { <h2>Le GitHub Integration™️</h2> },
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

const IdeSideBar = () => {
  return (
    <div className="h-full flex flex-col justify-between">
      <div className="w-14 h-16 flex items-center justify-center bg-ch-gray-900">
        <Link to={routes.home()}>
          <Svg className="w-12 p-0.5" name="favicon" />
        </Link>
      </div>
      <Tab.Group vertical>
        <Tab.List className="h-full flex flex-col justify-between">
          <div>
          { sidebarTopConfig.map(topItem => (
            <Tab disabled={topItem.disabled}
              key={'tab-'+topItem.name}
              className="text-gray-300 p-3 pb-6 flex justify-center">
              <Svg name={topItem.icon} className="w-8 mx-auto"/>
            </Tab>
          ))}
          </div>
          <div>
          { sidebarBottomConfig.map(bottomItem => (
            <Tab disabled={bottomItem.disabled}
              key={'tab-'+bottomItem.name}
              className="text-gray-300 p-3 pb-6 flex justify-center">
              <Svg name={bottomItem.icon} className="w-8 mx-auto" />
            </Tab>
          ))}
          </div>
        </Tab.List>
        <Tab.Panels>
          { ([...sidebarTopConfig, ...sidebarBottomConfig]).map(item => item.panel && (
            <Tab.Panel key={'panel-'+item.name}>{ item.panel }</Tab.Panel>
          )) }
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}

export default IdeSideBar
