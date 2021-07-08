import { lazy, Suspense } from 'react'
const IdeViewer = lazy(() => import('src/components/IdeViewer/IdeViewer'))
import { use3dViewerResize } from 'src/helpers/hooks/use3dViewerResize'

const BigLoadingPing = () => (
  <div className="inset-0 absolute flex items-center justify-center bg-ch-gray-800">
    <div className="h-16 w-16 bg-pink-600 rounded-full animate-ping"></div>
  </div>
)

const ProfileViewer = () => {
  const { viewerDomRef } = use3dViewerResize()
  return (
    <div className="h-full" ref={viewerDomRef}>
      <Suspense fallback={BigLoadingPing}>
        <IdeViewer Loading={BigLoadingPing} />
      </Suspense>
    </div>
  )
}

export default ProfileViewer
