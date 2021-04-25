import { Link, routes } from '@redwoodjs/router'
import Svg from 'src/components/Svg/Svg'
import { Popover } from '@headlessui/react'

const NavPlusButton: React.FC = () => {
  return (
    <Popover className="relative outline-none w-full h-full">
      <Popover.Button className="h-full w-full outline-none">
        <Svg name="plus" className="text-indigo-300" />
      </Popover.Button>

      <Popover.Panel className="absolute z-10">
        <ul className="bg-gray-200 mt-4 rounded shadow-md overflow-hidden">
          {[
            {
              name: 'OpenSCAD',
              sub: 'beta',
              ideType: 'openScad',
            },
            { name: 'CadQuery', sub: 'beta', ideType: 'cadQuery' },
            {
              name: 'CascadeStudio',
              sub: 'soon to be deprecated',
            },
          ].map(({ name, sub, ideType }) => (
            <li
              key={name}
              className="px-4 py-2 hover:bg-gray-400 text-gray-800"
            >
              <Link
                to={
                  name === 'CascadeStudio'
                    ? routes.draftPart()
                    : routes.devIde({ cadPackage: ideType })
                }
              >
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
