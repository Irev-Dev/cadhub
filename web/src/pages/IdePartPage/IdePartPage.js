import MainLayout from 'src/layouts/MainLayout'
import IdePartCell from 'src/components/IdePartCell'

const IdePartPage = ({ userName, partTitle }) => {
  return (
    <MainLayout>
      <IdePartCell userName={userName} partTitle={partTitle} />
    </MainLayout>
  )
}

export default IdePartPage
