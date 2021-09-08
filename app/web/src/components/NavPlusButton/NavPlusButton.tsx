import { Link, routes } from '@redwoodjs/router'
import Svg from 'src/components/Svg/Svg'
import { Popover } from '@headlessui/react'
import type { CadPackageType } from 'src/components/CadPackage/CadPackage'

const menuOptions: {
  name: string
  sub: string
  ideType: CadPackageType
}[] = [
  {
    name: 'OpenSCAD',
    sub: 'beta',
    ideType: 'openscad',
  },
  { name: 'CadQuery', sub: 'beta', ideType: 'cadquery' },
  // { name: 'JSCAD', sub: 'alpha', ideType: 'jscad' }, // TODO #422, add jscad to db schema when were ready to enable saving of jscad projects
]

const NavPlusButton: React.FC = () => {
  return (
    <Popover className="relative outline-none w-full h-full">
      <Popover.Button className="h-full w-full outline-none">
        <Svg name="plus" className="text-gray-200" />
      </Popover.Button>

      <Popover.Panel className="absolute z-10 right-0">
        <ul className="bg-gray-200 mt-4 rounded shadow-md overflow-hidden">
          {menuOptions.map(({ name, sub, ideType }) => (
            <li
              key={name}
              className="px-4 py-2 hover:bg-gray-400 text-gray-800"
            >
              <Link to={routes.draftProject({ cadPackage: ideType })}>
                <div>{name}</div>
                <div className="text-xs text-gray-600 font-light">{sub}</div>
              </Link>
            </li>
          ))}
        </ul>
      </Popover.Panel>
    </Popover>
  )
}

export default NavPlusButton
