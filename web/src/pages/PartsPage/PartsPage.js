import MainLayout from 'src/layouts/MainLayout'
import PartsLayout from 'src/layouts/PartsLayout'
import PartsCell from 'src/components/PartsCell'

const PartsPage = () => {
  return (
    <MainLayout>
      <PartsLayout>
        <PartsCell />
      </PartsLayout>
    </MainLayout>
  )
}

export default PartsPage
