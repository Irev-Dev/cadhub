import Seo from 'src/components/Seo/Seo'
import IdeToolbar from 'src/components/IdeToolbarNew'
import OutBound from 'src/components/OutBound'
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
      <div className="py-2 bg-pink-200">
        <div className="mx-auto max-w-3xl">
          We're still working on this. Since you're here, have a look what{' '}
          <OutBound
            className="text-pink-700"
            to="https://github.com/Irev-Dev/cadhub/discussions/212"
          >
            we've got planned
          </OutBound>
          .
        </div>
      </div>
      <div className="flex-auto">
        <IdeToolbar cadPackage={cadPackage} />
      </div>
    </div>
  )
}

export default DevIdePage
