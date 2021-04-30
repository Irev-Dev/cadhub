import SubjectAccessRequestsLayout from 'src/layouts/SubjectAccessRequestsLayout'
import SubjectAccessRequestCell from 'src/components/SubjectAccessRequestCell'

const SubjectAccessRequestPage = ({ id }) => {
  return (
    <SubjectAccessRequestsLayout>
      <SubjectAccessRequestCell id={id} />
    </SubjectAccessRequestsLayout>
  )
}

export default SubjectAccessRequestPage
