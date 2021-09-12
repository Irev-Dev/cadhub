import { useAuth } from '@redwoodjs/auth'
import { Popover } from '@headlessui/react'
import { Link, navigate, routes } from '@redwoodjs/router'
import { useIdeContext } from 'src/helpers/hooks/useIdeContext'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import FullScriptEncoding from 'src/components/EncodedUrl/FullScriptEncoding'
import ExternalScript from 'src/components/EncodedUrl/ExternalScript'
import Svg from 'src/components/Svg/Svg'
import NavPlusButton from 'src/components/NavPlusButton'
import ProfileSlashLogin from 'src/components/ProfileSlashLogin'
import Gravatar from 'src/components/Gravatar/Gravatar'
import EditableProjectTitle from 'src/components/EditableProjecTitle/EditableProjecTitle'
import CaptureButton from 'src/components/CaptureButton/CaptureButton'

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

interface IdeHeaderProps {
  handleRender: () => void
  projectTitle?: string
  projectOwner?: string
  projectOwnerId?: string
  projectOwnerImage?: string
  projectId?: string
}

const IdeHeader = ({
  handleRender,
  projectOwner,
  projectTitle,
  projectOwnerImage,
  projectId,
  projectOwnerId,
}: IdeHeaderProps) => {
  const { currentUser } = useAuth()
  const { project } = useIdeContext()
  const canEdit =
    (currentUser &&
      currentUser?.sub === (project?.user?.id || projectOwnerId)) ||
    currentUser?.roles.includes('admin')
  const _projectId = projectId || project?.id
  const _projectOwner = project?.user?.userName || projectOwner

  return (
    <div className="h-16 w-full bg-ch-gray-900 flex justify-between items-center text-lg">
      {_projectId ? (
        <div className="h-full text-gray-300 flex items-center">
          <span className="bg-ch-gray-700 h-full grid grid-flow-col-dense items-center gap-2 px-4">
            <Gravatar
              image={project?.user?.image || projectOwnerImage}
              className="w-10"
            />
            <Link
              to={routes.user({
                userName: _projectOwner,
              })}
            >
              {_projectOwner}
            </Link>
          </span>
          <EditableProjectTitle
            id={_projectId}
            userName={_projectOwner}
            projectTitle={project?.title || projectTitle}
            canEdit={canEdit}
            shouldRouteToIde={!projectTitle}
          />
        </div>
      ) : (
        <div />
      )}
      <div className="text-gray-200 grid grid-flow-col-dense gap-4 mr-4 items-center">
        {canEdit && !projectTitle && (
          <CaptureButton
            canEdit={canEdit}
            projectTitle={project?.title}
            userName={project?.user?.userName}
            shouldUpdateImage={!project?.mainImage}
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
        {!projectTitle && (
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
        {projectTitle && (
          <TopButton
            className="bg-ch-pink-800 bg-opacity-30 hover:bg-opacity-80 text-ch-gray-300"
            onClick={() =>
              navigate(routes.ide({ userName: _projectOwner, projectTitle }))
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
                <Popover.Button className="h-full w-full outline-none">
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
        {/* <TopButton>Fork</TopButton> */}
        <div className="h-8 w-8">
          <NavPlusButton />
        </div>
        <ProfileSlashLogin />
      </div>
    </div>
  )
}

export default IdeHeader
