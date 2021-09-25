import { Link, routes, navigate } from '@redwoodjs/router'
import { useAuth } from '@redwoodjs/auth'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import useUser from 'src/helpers/hooks/useUser'
import { CREATE_PROJECT_MUTATION } from 'src/components/ProjectCell/ProjectCell'
import Svg from 'src/components/Svg/Svg'
import { Popover } from '@headlessui/react'
import { CadPackageType } from 'src/components/CadPackage/CadPackage'

const menuOptions: {
  name: string
  sub: string
  dotClasses: string
  bgClasses: string
  ideType: CadPackageType
}[] = [
  {
    name: 'OpenSCAD',
    sub: 'beta',
    bgClasses: 'bg-yellow-800',
    dotClasses: 'bg-yellow-200',
    ideType: 'openscad',
  },
  {
    name: 'CadQuery',
    sub: 'beta',
    bgClasses: 'bg-ch-blue-700',
    dotClasses: 'bg-blue-800',
    ideType: 'cadquery',
  },
  {
    name: 'JSCAD',
    sub: 'beta',
    bgClasses: 'bg-ch-purple-500',
    dotClasses: 'bg-yellow-300',
    ideType: 'jscad',
  },
]

const NavPlusButton: React.FC = () => {
  const { isAuthenticated } = useAuth()
  const { user } = useUser()
  const [createProject] = useMutation(CREATE_PROJECT_MUTATION, {})
  const handleCreate = async (ideType) => {
    const projectPromise = createProject({
      variables: { input: { userId: user.id, cadPackage: ideType } },
    })
    toast.promise(projectPromise, {
      loading: 'creating Project',
      success: <b>Initializing</b>,
      error: <b>Problem creating.</b>,
    })
    const {
      data: { createProject: project },
    } = await projectPromise
    navigate(
      routes.ide({
        userName: project?.user?.userName,
        projectTitle: project?.title,
      })
    )
  }
  const ButtonWrap = ({ children, ideType }) =>
    isAuthenticated && user ? (
      <button className="text-left" onClick={() => handleCreate(ideType)}>
        {children}
      </button>
    ) : (
      <Link to={routes.draftProject({ cadPackage: ideType })}>{children}</Link>
    )
  return (
    <Popover className="relative outline-none w-full h-full">
      <Popover.Button className="h-full w-full outline-none hover:bg-ch-gray-550 border-ch-gray-400 border-2 rounded-full">
        <Svg name="plus" className="text-ch-gray-300" />
      </Popover.Button>

      <Popover.Panel className="absolute w-48 z-10 right-0 bg-ch-gray-700 mt-4 px-3 py-2 rounded shadow-md overflow-hidden text-ch-gray-300">
        <p className="text-lg">New Project</p>
        <hr className="my-2" />
        <ul className="">
          {menuOptions.map(({ name, sub, ideType, bgClasses, dotClasses }) => (
            <li
              key={name}
              className={
                bgClasses +
                ' px-4 py-1 my-4 bg-opacity-30 hover:bg-opacity-70 grid items-center gap-2'
              }
              style={{ gridTemplateColumns: '2.5rem 1fr' }}
            >
              <div
                className={
                  dotClasses + ' justify-self-center w-5 h-5 rounded-full'
                }
              ></div>
              <ButtonWrap ideType={ideType}>
                <div>{name}</div>
                <div className="text-xs text-ch-gray-400 font-light">{sub}</div>
              </ButtonWrap>
            </li>
          ))}
        </ul>
      </Popover.Panel>
    </Popover>
  )
}

export default NavPlusButton
