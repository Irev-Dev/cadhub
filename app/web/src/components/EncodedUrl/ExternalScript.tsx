import { useState } from 'react'
import { useIdeContext, ideTypeNameMap } from 'src/helpers/hooks/useIdeContext'
import OutBound from 'src/components/OutBound/OutBound'
import { prepareEncodedUrl, makeExternalUrl } from './helpers'
import { copyTextToClipboard } from 'src/helpers/clipboard'
import { useRender } from 'src/components/IdeWrapper/useRender'
import { toast } from '@redwoodjs/web/toast'

const ExternalScript = () => {
  const { state, thunkDispatch } = useIdeContext()
  const handleRender = useRender()
  const [rawUrl, setRawUrl] = useState('')
  const [script, setScript] = useState('')
  const [asyncState, setAsyncState] = useState<
    'INIT' | 'SUCCESS' | 'ERROR' | 'LOADING'
  >('INIT')

  const cadName = ideTypeNameMap[state.ideType]

  const onPaste: React.ClipboardEventHandler<HTMLInputElement> = async ({
    clipboardData,
  }) => {
    const url = clipboardData.getData('Text')
    processUserUrl(url)
  }
  const onChange: React.ChangeEventHandler<HTMLInputElement> = async ({
    target,
  }) => setRawUrl(target.value)
  const onKeyDown = async ({ key, target }) =>
    key === 'Enter' && processUserUrl(target.value)

  async function processUserUrl(url: string) {
    setRawUrl(url)
    try {
      setAsyncState('LOADING')
      const response = await fetch(prepareEncodedUrl(url))
      if (response.status === 404) throw new Error("couldn't find script")
      const script2 = await response.text()
      if (script2.startsWith('<!DOCTYPE html>'))
        throw new Error('got html document, not a script')
      setScript(script2)
      setAsyncState('SUCCESS')
    } catch (e) {
      setAsyncState('ERROR')
      toast.error(
        "We had trouble with you're URL, are you sure it was correct?"
      )
    }
  }
  const onCopyRender: React.MouseEventHandler<HTMLButtonElement> = () => {
    copyTextToClipboard(makeExternalUrl(rawUrl))
    thunkDispatch({ type: 'updateCode', payload: script })
    setTimeout(handleRender)
  }
  return (
    <div className="p-4">
      <p className="text-sm pb-4 border-b border-gray-700">
        Paste an external url containing a {cadName} script to generate a new
        CadHub url for this resource.{' '}
        <OutBound
          className="underline text-gray-500"
          to="https://learn.cadhub.xyz/docs/general-cadhub/external-resource-url"
        >
          Learn more
        </OutBound>{' '}
        about this feature.
      </p>
      {['INIT', 'ERROR'].includes(asyncState) && (
        <>
          <p className="mt-4">Paste url</p>
          <input
            className="p-1 text-xs border border-ch-purple-450 w-full"
            value={rawUrl}
            onChange={onChange}
            onPaste={onPaste}
            onKeyDown={onKeyDown}
          />
        </>
      )}
      {asyncState === 'ERROR' && (
        <p className="text-sm text-red-800">That didn't work, try again.</p>
      )}
      {asyncState === 'LOADING' && (
        <div className="h-10 relative">
          <div className="inset-0 absolute flex items-center justify-center">
            <div className="h-6 w-6 bg-pink-600 rounded-full animate-ping"></div>
          </div>
        </div>
      )}
      {asyncState === 'SUCCESS' && (
        <>
          <input
            value={makeExternalUrl(rawUrl).replace(/^.+:\/\//g, '')}
            readOnly
            className="py-1 px-2 mt-4 text-xs border border-ch-purple-450 w-full"
          />
          <button
            className="w-full bg-ch-purple-450 hover:bg-ch-purple-400 py-1 text-gray-300"
            onClick={() => copyTextToClipboard(makeExternalUrl(rawUrl))}
          >
            Copy URL
          </button>
          <div className="flex flex-col gap-2 pt-2">
            <button
              className="bg-gray-500 hover:bg-gray-600 p-1 px-2 text-gray-200"
              onClick={onCopyRender}
            >
              Copy &amp; Render
            </button>
            <button
              className="bg-gray-500 hover:bg-gray-600 p-1 px-2 text-gray-200"
              onClick={() => {
                setAsyncState('INIT')
                setRawUrl('')
                setScript('')
              }}
            >
              Create another URL
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default ExternalScript
