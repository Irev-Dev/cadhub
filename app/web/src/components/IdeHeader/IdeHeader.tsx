import { Popover } from '@headlessui/react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import FullScriptEncoding from 'src/components/EncodedUrl/FullScriptEncoding'
import ExternalScript from 'src/components/EncodedUrl/ExternalScript'
import Svg from 'src/components/Svg/Svg'

const TopButton = ({
  onClick,
  children,
  className,
  name,
}: {
  onClick?: () => void
  children: React.ReactNode
  className?: string
  name: string
}) => (
  <button
    onClick={onClick}
    className={`flex bg-gray-200 h-10 justify-center items-center px-4 rounded ${className}`}
  >
    {children}
    <span className="hidden md:block ml-2">{name}</span>
  </button>
)

const IdeHeader = ({ handleRender }: { handleRender: () => void }) => {
  return (
    <div className="h-16 w-full bg-ch-gray-900 flex justify-between items-center">
      <div className="bg-ch-gray-700 md:pr-48 h-full"></div>
      <div className="text-gray-200 flex gap-4 mr-4">
        <TopButton
          className="bg-ch-pink-800 bg-opacity-30 hover:bg-opacity-80 text-ch-gray-300"
          onClick={handleRender}
          name="Preview"
        >
          <Svg name="photograph" className="w-6 h-6 text-ch-pink-500" />
        </TopButton>

        <Popover className="relative outline-none w-full h-full">
          {({ open }) => {
            return (
              <>
                <Popover.Button className="h-full w-full outline-none">
                  <TopButton
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
