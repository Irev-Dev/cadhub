import { useIdeInit } from 'src/components/EncodedUrl/helpers'
import { useIdeContext } from 'src/helpers/hooks/useIdeContext'
import IdeViewer from 'src/components/IdeViewer/IdeViewer'
import { use3dViewerResize } from 'src/helpers/hooks/use3dViewerResize'

function EmbedViewer() {
    const { state, project } = useIdeContext()
    console.log('from EmbedViewer', { cadPackage: project.cadPackage, code: project.code })
    useIdeInit(project?.cadPackage, project?.code || state?.code, "viewer")
    const { viewerDomRef } = use3dViewerResize()

    return (
        <div className="h-screen flex flex-col">
            <IdeViewer isMinimal={true} />
        </div>
    )
}

export default EmbedViewer