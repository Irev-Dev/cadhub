import { Popover } from '@headlessui/react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { copyTextToClipboard } from 'src/helpers/clipboard'
import { encode } from 'src/helpers/compress'

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
  <button onClick={onClick} className={`flex bg-gray-200 h-10 justify-center items-center px-4 rounded ${className}`}>
    <div className={`rounded-full h-6 w-6 mr-4 ${iconColor}`}/>
    {children}
  </button>
)

const IdeHeader = ({handleRender}: {handleRender: () => void}) => {
  return (
    <div className="h-16 w-full bg-gray-900 flex justify-between items-center">
      <div className="bg-gray-700 pr-48 h-full">
      </div>
      <div className="text-gray-200 flex gap-4 mr-4">
        <TopButton
          className="bg-gray-600 text-gray-200"
          iconColor="bg-gray-300"
          onClick={handleRender}
        >Render</TopButton>

        <Popover className="relative outline-none w-full h-full">
          {({open}) => {
            const encodedLink = makeEncodedLink('bing bong')
            return (
              <>
                <Popover.Button className="h-full w-full outline-none">
                  <TopButton iconColor="bg-gray-600" className="text-gray-700">Share</TopButton>
                </Popover.Button>
                {open && <Popover.Panel className="absolute z-10 mt-4 right-0">
                  <Tabs
                    className="bg-gray-300 rounded-md shadow-md overflow-hidden text-gray-700"
                    selectedTabClassName="bg-gray-200"
                  >
                    <TabPanel className="p-4">
                      <p className="text-sm pb-4 border-b border-gray-700">Encodes your CodeCad script into a URL so that you can share your work</p>
                      <input value={encodedLink.replace(/^.+:\/\//g, '')} readOnly className="p-1 mt-4 text-xs rounded-t border border-gray-700 w-full" />
                      <button className="w-full bg-gray-700 py-1 rounded-b text-gray-300" onClick={() => copyTextToClipboard(encodedLink)} >Copy URL</button>
                    </TabPanel>
                    <TabPanel>
                      <h2 className="h-32">Any content 2</h2>
                    </TabPanel>

                    <TabList className="flex whitespace-nowrap text-gray-700 border-t border-gray-700">
                      <Tab className="p-3 px-5">encoded script</Tab>
                      <Tab className="p-3 px-5">external script</Tab>
                    </TabList>
                  </Tabs>
                </Popover.Panel>}
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

const scriptKeyV2 = 'encoded_script_v2' // todo don't leave here

function makeEncodedLink(code: string): string {
  const encodedScript = encode(code)
  return `${location.href}#${scriptKeyV2}=${encodedScript}`
}
