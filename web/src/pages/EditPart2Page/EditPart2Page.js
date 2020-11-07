import MainLayout from 'src/layouts/MainLayout'
import Part2Cell from 'src/components/Part2Cell'

const EditPart2Page = ({userName, partTitle}) => {
  return (
    <MainLayout>
      <Part2Cell userName={userName} partTitle={partTitle} isEditable/>
    </MainLayout>
  )
}

export default EditPart2Page
