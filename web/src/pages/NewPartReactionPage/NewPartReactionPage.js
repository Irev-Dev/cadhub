import MainLayout from 'src/layouts/MainLayout'
import NewPartReaction from 'src/components/NewPartReaction'
import Seo from 'src/components/Seo/Seo'

const NewPartReactionPage = () => {
  return (
    <MainLayout>
      <Seo
        title="New part reaction"
        description="New part reaction page"
        lang="en-US"
      />

      <NewPartReaction />
    </MainLayout>
  )
}

export default NewPartReactionPage
