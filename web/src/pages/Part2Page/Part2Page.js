import MainLayout from 'src/layouts/MainLayout'
import Part2Cell from 'src/components/Part2Cell'

const Part2Page = ({userName, partTitle}) => {
  return (
    <MainLayout>
      <Part2Cell userName={userName} partTitle={partTitle}/>
    </MainLayout>
  )
}

export default Part2Page
