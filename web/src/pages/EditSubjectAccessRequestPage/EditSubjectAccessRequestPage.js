import SubjectAccessRequestsLayout from 'src/layouts/SubjectAccessRequestsLayout'
import EditSubjectAccessRequestCell from 'src/components/EditSubjectAccessRequestCell'

const EditSubjectAccessRequestPage = ({ id }) => {
  return (
    <SubjectAccessRequestsLayout>
      <EditSubjectAccessRequestCell id={id} />
    </SubjectAccessRequestsLayout>
  )
}

export default EditSubjectAccessRequestPage
