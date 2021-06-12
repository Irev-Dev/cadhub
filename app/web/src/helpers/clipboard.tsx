import { toast } from '@redwoodjs/web/toast'

function fallbackCopyTextToClipboard(text: string) {
  var textArea = document.createElement('textarea')
  textArea.value = text

  // Avoid scrolling to bottom
  textArea.style.top = '0'
  textArea.style.left = '0'
  textArea.style.position = 'fixed'

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    var successful = document.execCommand('copy')
    var msg = successful ? 'successful' : 'unsuccessful'
    console.log('Fallback: Copying text command was ' + msg)
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err)
  }

  document.body.removeChild(textArea)
}

const clipboardSuccessToast = (text: string) => toast.success(() => (
  <div className="overflow-hidden">
    <p>link added to clipboard.</p>
  </div>
))

const makeClipboardCopier = (success: Function) => (text: string) => {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text)
    success(text)
    return
  }
  navigator.clipboard.writeText(text).then(
    function () {
      console.log('Async: Copying to clipboard was successful!')
      success(text)
    },
    function (err) {
      console.error('Async: Could not copy text: ', err)
    }
  )
}

export const copyTextToClipboard = makeClipboardCopier(clipboardSuccessToast)
