import { Popover } from '@headlessui/react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import FullScriptEncoding from 'src/components/EncodedUrl/FullScriptEncoding'
import ExternalScript from 'src/components/EncodedUrl/ExternalScript'

const TopButton = ({
  onClick,
  children,
  className,
  iconColor,
}: {
  onClick?: () => void
  children: React.ReactNode
  className?: string
  iconColor: string
}) => (
  <button
    onClick={onClick}
    className={`flex bg-gray-200 h-10 justify-center items-center px-4 rounded ${className}`}
  >
    <div className={`rounded-full h-6 w-6 mr-4 ${iconColor}`} />
    {children}
  </button>
)

const IdeHeader = ({ handleRender }: { handleRender: () => void }) => {
  return (
    <div className="h-16 w-full bg-gray-900 flex justify-between items-center">
      <div className="bg-gray-700 pr-48 h-full"></div>
      <div className="text-gray-200 flex gap-4 mr-4">
        <TopButton
          className="bg-gray-600 text-gray-200"
          iconColor="bg-gray-300"
          onClick={handleRender}
        >
          Render
        </TopButton>

        <Popover className="relative outline-none w-full h-full">
          {({ open }) => {
            return (
              <>
                <Popover.Button className="h-full w-full outline-none">
                  <TopButton iconColor="bg-gray-600" className="text-gray-700">
                    Share
                  </TopButton>
                </Popover.Button>
                {open && (
                  <Popover.Panel className="absolute z-10 mt-4 right-0">
                    <Tabs
                      className="bg-gray-300 rounded-md shadow-md overflow-hidden text-gray-700"
                      selectedTabClassName="bg-gray-200"
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
      </div>
    </div>
  )
}

export default IdeHeader
