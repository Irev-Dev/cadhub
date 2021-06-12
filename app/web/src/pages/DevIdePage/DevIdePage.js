import Seo from 'src/components/Seo/Seo'
import IdeToolbar from 'src/components/IdeToolbarNew'
import { Toaster } from '@redwoodjs/web/toast'

const DevIdePage = ({ cadPackage }) => {
  return (
    <div className="h-screen flex flex-col">
      <Seo
        title="new ide in development"
        description="new ide in development"
        lang="en-US"
      />
      <Toaster timeout={9000} />
      <IdeToolbar cadPackage={cadPackage} />
    </div>
  )
}

export default DevIdePage
