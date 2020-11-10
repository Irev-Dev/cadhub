import { Link, routes } from '@redwoodjs/router'
import MainLayout from 'src/layouts/MainLayout'
import IdePartCell from 'src/components/IdePartCell'

const IdePartPage = ({ id }) => {
  return (
    <MainLayout>
      <IdePartCell id={id} />
    </MainLayout>
  )
}

export default IdePartPage
