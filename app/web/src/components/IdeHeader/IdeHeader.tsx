import { useAuth } from '@redwoodjs/auth'
import { useMutation } from '@redwoodjs/web'
import { Popover } from '@headlessui/react'
import { Link, navigate, routes } from '@redwoodjs/router'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

import FullScriptEncoding from 'src/components/EncodedUrl/FullScriptEncoding'
import ExternalScript from 'src/components/EncodedUrl/ExternalScript'
import Svg from 'src/components/Svg/Svg'
import { toast } from '@redwoodjs/web/toast'
import CaptureButton from 'src/components/CaptureButton/CaptureButton'
import { useIdeContext } from 'src/helpers/hooks/useIdeContext'
import Gravatar from 'src/components/Gravatar/Gravatar'
import EditableProjectTitle from 'src/components/EditableProjecTitle/EditableProjecTitle'

const FORK_PROJECT_MUTATION = gql`
  mutation ForkProjectMutation($input: ForkProjectInput!) {
    forkProject(input: $input) {
      id
      title
      user {
        id
        userName
      }
    }
  }
`

const TopButton = ({
  onClick,
  children,
  className,
  name,
  Tag = 'button',
}: {
  onClick?: () => void
  children: React.ReactNode
  className?: string
  name: string
  Tag?: string
}) => {
  const FinalTag = Tag as unknown as keyof JSX.IntrinsicElements
  return (
    <FinalTag
      onClick={onClick}
      className={`flex bg-gray-200 h-10 flex-shrink-0 justify-center items-center px-4 rounded ${className} whitespace-nowrap`}
    >
      {children}
      <span className="hidden md:block ml-2">{name}</span>
    </FinalTag>
  )
}

export default function IdeHeader({
  handleRender,
  context,
}: {
  handleRender?: () => void
  context: 'ide' | 'profile'
}) {
  const { currentUser } = useAuth()
  const { project, state } = useIdeContext()
  const hasUnsavedChanges =
    project?.code && state?.code && project?.code !== state?.code

  const isProfile = context === 'profile'
  const canEdit =
    (currentUser && currentUser?.sub === project?.user?.id) ||
    currentUser?.roles?.includes('admin')
  const projectOwner = project?.user?.userName
  const showForkMessage = !canEdit && hasUnsavedChanges && currentUser?.sub

  const [createFork] = useMutation(FORK_PROJECT_MUTATION, {
    onCompleted: ({ forkProject }) => {
      const params = {
        userName: forkProject?.user?.userName,
        projectTitle: forkProject?.title,
      }
      navigate(!isProfile ? routes.ide(params) : routes.project(params))
    },
  })
  const handleFork = () => {
    const prom = createFork({
      variables: {
        input: {
          userId: currentUser.sub,
          forkedFromId: project?.id,
        },
      },
    })
    toast.promise(prom, {
      loading: 'Forking...',
      success: <b>Forked successfully!</b>,
      error: <b>Problem forking.</b>,
    })
  }

  return (
    <>
      <div className="flex justify-between flex-grow h-full">
        <div className="flex h-full items-center text-gray-300">
          {project?.id && (
            <>
              <span className="bg-ch-gray-700 h-full grid grid-flow-col-dense items-center gap-2 px-4">
                <Gravatar image={project?.user?.image} className="w-10" />
                <Link
                  to={routes.user({
                    userName: projectOwner,
                  })}
                >
                  {projectOwner}
                </Link>
              </span>
              <EditableProjectTitle
                id={project?.id}
                userName={projectOwner}
                projectTitle={project?.title}
                canEdit={canEdit}
                shouldRouteToIde={!isProfile}
              />
            </>
          )}
        </div>
        <div className="grid grid-flow-col-dense gap-4 items-center mr-4">
          {canEdit && !isProfile && (
            <CaptureButton
              TheButton={({ onClick }) => (
                <TopButton
                  onClick={onClick}
                  name="Save Project Image"
                  className=" bg-ch-blue-650 bg-opacity-30 hover:bg-opacity-80 text-ch-gray-300"
                >
                  <Svg name="camera" className="w-6 h-6 text-ch-blue-400" />
                </TopButton>
              )}
            />
          )}
          {!isProfile && (
            <TopButton
              className="bg-ch-pink-800 bg-opacity-30 hover:bg-opacity-80 text-ch-gray-300"
              onClick={handleRender}
              name={canEdit ? 'Save' : 'Preview'}
            >
              <Svg
                name={canEdit ? 'floppy-disk' : 'photograph'}
                className="w-6 h-6 text-ch-pink-500"
              />
            </TopButton>
          )}
          {isProfile && (
            <TopButton
              className="bg-ch-pink-800 bg-opacity-30 hover:bg-opacity-80 text-ch-gray-300"
              onClick={() =>
                navigate(
                  routes.ide({
                    userName: projectOwner,
                    projectTitle: project.title,
                  })
                )
              }
              name="Editor"
            >
              <Svg name="terminal" className="w-6 h-6 text-ch-pink-500" />
            </TopButton>
          )}
          <Popover className="relative outline-none w-full h-full">
            {({ open }) => {
              return (
                <>
                  <Popover.Button className="h-full outline-none">
                    <TopButton
                      Tag="div"
                      name="Share"
                      className=" bg-ch-purple-400 bg-opacity-30 hover:bg-opacity-80 text-ch-gray-300"
                    >
                      <Svg
                        name="share"
                        className="w-6 h-6 text-ch-purple-500 mt-1"
                      />
                    </TopButton>
                  </Popover.Button>
                  {open && (
                    <Popover.Panel className="absolute z-10 mt-4 right-0">
                      <Tabs
                        className="bg-ch-purple-gray-200 rounded-md shadow-md overflow-hidden text-gray-700"
                        selectedTabClassName="bg-ch-gray-700 text-white"
                      >
                        <TabPanel>
                          <FullScriptEncoding />
                        </TabPanel>
                        <TabPanel>
                          <ExternalScript />
                        </TabPanel>

                        <TabList className="flex whitespace-nowrap text-gray-700 border-t border-gray-700">
                          <Tab className="p-3 px-5">encoded script</Tab>
                          <Tab className="p-3 px-5">external script</Tab>
                        </TabList>
                      </Tabs>
                    </Popover.Panel>
                  )}
                </>
              )
            }}
          </Popover>
          {currentUser?.sub && (
            <TopButton
              onClick={handleFork}
              name="Fork"
              className={
                showForkMessage
                  ? ' bg-ch-blue-650 bg-opacity-80 hover:bg-opacity-100 text-ch-gray-300 border-blue-300 border-2'
                  : ' bg-ch-blue-650 bg-opacity-30 hover:bg-opacity-80 text-ch-gray-300'
              }
            >
              <Svg name="fork-new" className="w-6 h-6 text-ch-blue-400" />
            </TopButton>
          )}
          {showForkMessage && (
            <div className="fixed bg-white w-60 h-10 top-16 right-24 z-10 rounded-md text-sm flex p-2 items-center">
              <Svg
                name="exclamation-circle"
                className="w-8 h-8 mx-2 text-ch-blue-500"
              />{' '}
              Fork to save your work
            </div>
          )}
        </div>
      </div>
    </>
  )
}
