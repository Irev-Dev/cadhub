import { useState } from 'react'
import IdeContainer from 'src/components/IdeContainer/IdeContainer'
import { useRender } from './useRender'
import OutBound from 'src/components/OutBound/OutBound'
import IdeSideBar from 'src/components/IdeSideBar/IdeSideBar'
import IdeHeader from 'src/components/IdeHeader/IdeHeader'
import Svg from 'src/components/Svg/Svg'
import { useIdeInit } from 'src/components/EncodedUrl/helpers'

const IdeToolbarNew = ({ cadPackage }) => {
  const [shouldShowConstructionMessage, setShouldShowConstructionMessage] =
    useState(true)
  const handleRender = useRender()
  useIdeInit(cadPackage)

  return (
    <div className="h-full flex">
      <div className="w-16 bg-gray-700 flex-shrink-0">
        <IdeSideBar />
      </div>
      <div className="h-full flex flex-grow flex-col">
        <nav className="flex">
          <IdeHeader handleRender={handleRender} />
        </nav>
        {shouldShowConstructionMessage && (
          <div className="py-2 bg-pink-200 flex">
            <div className="flex-grow text-center">
              We're still working on this. Since you're here, have a look what{' '}
              <OutBound
                className="text-pink-700"
                to="https://github.com/Irev-Dev/cadhub/discussions/212"
              >
                we've got planned
              </OutBound>
              .
            </div>
            <button
              className="flex mr-3"
              onClick={() => setShouldShowConstructionMessage(false)}
            >
              <Svg className="h-4 w-6 text-gray-500 items-center" name="x" />
            </button>
          </div>
        )}
        <IdeContainer />
      </div>
    </div>
  )
}

export default IdeToolbarNew
