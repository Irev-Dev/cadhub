import { useMutation, useFlash } from '@redwoodjs/web'
import { navigate, routes } from '@redwoodjs/router'
import SubjectAccessRequestForm from 'src/components/SubjectAccessRequestForm'

export const QUERY = gql`
  query FIND_SUBJECT_ACCESS_REQUEST_BY_ID($id: String!) {
    subjectAccessRequest: subjectAccessRequest(id: $id) {
      id
      comment
      payload
      userId
      createdAt
      updatedAt
    }
  }
`
const UPDATE_SUBJECT_ACCESS_REQUEST_MUTATION = gql`
  mutation UpdateSubjectAccessRequestMutation(
    $id: String!
    $input: UpdateSubjectAccessRequestInput!
  ) {
    updateSubjectAccessRequest(id: $id, input: $input) {
      id
      comment
      payload
      userId
      createdAt
      updatedAt
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Success = ({ subjectAccessRequest }) => {
  const { addMessage } = useFlash()
  const [updateSubjectAccessRequest, { loading, error }] = useMutation(
    UPDATE_SUBJECT_ACCESS_REQUEST_MUTATION,
    {
      onCompleted: () => {
        navigate(routes.subjectAccessRequests())
        addMessage('SubjectAccessRequest updated.', {
          classes: 'rw-flash-success',
        })
      },
    }
  )

  const onSave = (input, id) => {
    updateSubjectAccessRequest({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit SubjectAccessRequest {subjectAccessRequest.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <SubjectAccessRequestForm
          subjectAccessRequest={subjectAccessRequest}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
