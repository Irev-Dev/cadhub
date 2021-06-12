import { useContext, useEffect, useState } from 'react'
import IdeContainer from 'src/components/IdeContainer'
import { IdeContext } from 'src/pages/DevIdePage/DevIdePage'
import { isBrowser } from '@redwoodjs/prerender/browserUtils'
import { useRender } from './useRender'
import { decode } from 'src/helpers/compress'
import { flow } from 'lodash/fp'
import OutBound from 'src/components/OutBound'
import IdeSideBar from 'src/components/IdeSideBar'
import IdeHeader from 'src/components/IdeHeader'
import Svg from 'src/components/Svg'

export const githubSafe = (url) =>
  url.includes('github.com')
    ? url
        .replace('github.com', 'raw.githubusercontent.com')
        .replace('/blob/', '/')
    : url

const prepareEncodedUrl = flow(decodeURIComponent, githubSafe)

const IdeToolbarNew = ({ cadPackage }) => {
  const { state, thunkDispatch } = useContext(IdeContext)
  const [shouldShowConstructionMessage, setShouldShowConstructionMessage] = useState(true)
  const handleRender = useRender()
  const scriptKey = 'encoded_script'
  const scriptKeyV2 = 'encoded_script_v2'
  const fetchText = 'fetch_text_v1'
  useEffect(() => {
    thunkDispatch({
      type: 'initIde',
      payload: { cadPackage },
    })
    // load code from hash if it's there
    const triggerRender = () =>
      setTimeout(() => {
        // definitely a little hacky, timeout with no delay is just to push it into the next event loop.
        handleRender()
      })
    let hash
    if (isBrowser) {
      hash = window.location.hash
    }
    const [key, encodedScript] = hash.slice(1).split('=')
    if (key === scriptKey) {
      const script = atob(encodedScript)
      thunkDispatch({ type: 'updateCode', payload: script })
      triggerRender()
    } else if (key === scriptKeyV2) {
      const script = decode(encodedScript)
      thunkDispatch({ type: 'updateCode', payload: script })
      triggerRender()
    } else if (key === fetchText) {
      const url = prepareEncodedUrl(encodedScript)
      fetch(url).then((response) =>
        response.text().then((script) => {
          thunkDispatch({ type: 'updateCode', payload: script })
          triggerRender()
        })
      )
    } else {
      triggerRender()
    }
    window.location.hash = ''
  }, [cadPackage])

  return (
    <div className="h-full flex">
      <div className="w-16 bg-gray-700 flex-shrink-0">
        <IdeSideBar />
      </div>
      <div className="h-full flex flex-grow flex-col">
        <nav className="flex">
          <IdeHeader handleRender={handleRender} />
        </nav>
        {shouldShowConstructionMessage && <div className="py-2 bg-pink-200 flex">
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
          <button className="flex" onClick={() => setShouldShowConstructionMessage(false)}>
            <Svg className="h-4 w-6 text-gray-500 mr-3 items-center" name="x"/>
          </button>
        </div>}
        <IdeContainer />
      </div>
    </div>
  )
}

export default IdeToolbarNew
