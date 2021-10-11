import IdeViewer from 'src/components/IdeViewer/IdeViewer'
import { use3dViewerResize } from 'src/helpers/hooks/use3dViewerResize'

const ProfileViewer = () => {
  const { viewerDomRef } = use3dViewerResize()
  return (
    <div className="h-full" ref={viewerDomRef}>
      <IdeViewer />
    </div>
  )
}

export default ProfileViewer
