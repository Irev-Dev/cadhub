import { useEffect } from 'react'
import { flow } from 'lodash/fp'

import {useIdeContext} from 'src/helpers/hooks/useIdeContext'
import { useRender } from 'src/components/IdeWrapper/useRender'
import {encode, decode} from 'src/helpers/compress'
import { isBrowser } from '@redwoodjs/prerender/browserUtils'

const scriptKey = 'encoded_script'
const scriptKeyV2 = 'encoded_script_v2'
const fetchText = 'fetch_text_v1'

export function makeEncodedLink(code: string): string {
  const encodedScript = encode(code)
  return `${location.origin}${location.pathname}#${scriptKeyV2}=${encodedScript}`
}

export const githubSafe = (url: string): string =>
  url.includes('github.com')
    ? url
        .replace('github.com', 'raw.githubusercontent.com')
        .replace('/blob/', '/')
    : url

const prepareEncodedUrl = flow(decodeURIComponent, githubSafe)

export function useIdeInit(cadPackage: string) {
  const {thunkDispatch} = useIdeContext()
  const handleRender = useRender()
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
}
