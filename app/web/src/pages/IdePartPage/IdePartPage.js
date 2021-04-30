import MainLayout from 'src/layouts/MainLayout'
import IdePartCell from 'src/components/IdePartCell'
import Seo from 'src/components/Seo/Seo'

const IdePartPage = ({ userName, partTitle }) => {
  return (
    <MainLayout shouldRemoveFooterInIde>
      <Seo title={partTitle} description={partTitle} lang="en-US" />

      <IdePartCell userName={userName} partTitle={partTitle} />
    </MainLayout>
  )
}

export default IdePartPage
