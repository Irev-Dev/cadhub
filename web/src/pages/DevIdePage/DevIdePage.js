import MainLayout from 'src/layouts/MainLayout'
import Seo from 'src/components/Seo/Seo'
import IdeToolbar from 'src/components/IdeToolbarNew'
import OutBound from 'src/components/OutBound'

const DevIdePage = () => {
  return (
    <MainLayout>
      <Seo
        title="new ide in development"
        description="new ide in development"
        lang="en-US"
      />
      <div className="py-4 bg-pink-200">
        <div className="mx-auto max-w-6xl">
          Woah, woah. You shouldn't be here! We're still working on this. Since
          you've seen it now, have a look what{' '}
          <OutBound
            className="text-pink-700"
            to="https://github.com/Irev-Dev/cadhub/discussions/212"
          >
            we've got planned
          </OutBound>
          .
        </div>
      </div>
      <IdeToolbar />
    </MainLayout>
  )
}

export default DevIdePage
