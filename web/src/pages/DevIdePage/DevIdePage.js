import MainLayout from 'src/layouts/MainLayout'
import Seo from 'src/components/Seo/Seo'
import IdeToolbar from 'src/components/IdeToolbarNew'
import OutBound from 'src/components/OutBound'

const DevIdePage = ({ cadPackage }) => {
  return (
    <div className="h-screen flex flex-col">
      <MainLayout shouldRemoveFooterInIde>
        <Seo
          title="new ide in development"
          description="new ide in development"
          lang="en-US"
        />
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
      </MainLayout>
      <div className="flex-auto">
        <IdeToolbar cadPackage={cadPackage} />
      </div>
    </div>
  )
}

export default DevIdePage
