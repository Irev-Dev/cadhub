import { lazy, Suspense } from 'react'
const IdeViewer = lazy(() => import('src/components/IdeViewer/IdeViewer'))
import { use3dViewerResize } from 'src/helpers/hooks/use3dViewerResize'
import { BigLoadingPing } from 'src/components/IdeContainer/IdeContainer'

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
