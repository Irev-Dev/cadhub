import { useIdeInit } from 'src/components/EncodedUrl/helpers'
import { useIdeContext } from 'src/helpers/hooks/useIdeContext'
import IdeViewer from 'src/components/IdeViewer/IdeViewer'
import { use3dViewerResize } from 'src/helpers/hooks/use3dViewerResize'
import CadPackage from '../CadPackage/CadPackage'
import LogoType from '../LogoType/LogoType'
import { Link, routes } from '@redwoodjs/router'

function EmbedViewer() {
  const { state, project } = useIdeContext()
  useIdeInit(project?.cadPackage, project?.code || state?.code, 'viewer')
  const { viewerDomRef } = use3dViewerResize()

  return (
    <div className="relative flex flex-col h-screen group" ref={viewerDomRef}>
      <IdeViewer isMinimal={true} />
      <div className="absolute top-5 left-5 text-ch-gray-300">
        <h1 className="mb-4 text-4xl font-normal capitalize ">
          {project?.title.replace(/-/g, ' ')}
        </h1>
        <h2 className="mb-2 transition-opacity duration-100 group-hover:opacity-0">
          by @{project?.user?.userName}
        </h2>
        <h2 className="transition-opacity duration-100 group-hover:opacity-0">
          built with{' '}
          <div className="inline-block">
            <CadPackage
              cadPackage={project?.cadPackage}
              className="px-3 py-2"
            />
          </div>
        </h2>
      </div>
      <div className="absolute grid items-center grid-flow-col-dense gap-2 bottom-5 right-5 text-ch-gray-300">
        View on{' '}
        <Link
          className="inline-block"
          to={routes.project({
            userName: project?.user?.userName,
            projectTitle: project?.title.toString(),
          })}
        >
          <LogoType className="inline-block" wrappedInLink={true} />
        </Link>
      </div>
    </div>
  )
}

export default EmbedViewer
