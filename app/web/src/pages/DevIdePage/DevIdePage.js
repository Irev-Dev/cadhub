import Seo from 'src/components/Seo/Seo'
import IdeToolbar from 'src/components/IdeToolbarNew'
import IdeHeader from 'src/components/IdeHeader'

const DevIdePage = ({ cadPackage }) => {
  return (
    <div className="h-screen flex flex-col">
      <Seo
        title="new ide in development"
        description="new ide in development"
        lang="en-US"
      />
      <IdeHeader />
      <div className="flex-auto">
        <IdeToolbar cadPackage={cadPackage} />
      </div>
    </div>
  )
}

export default DevIdePage
