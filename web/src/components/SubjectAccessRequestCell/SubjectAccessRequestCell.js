import SubjectAccessRequest from 'src/components/SubjectAccessRequest'

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

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>SubjectAccessRequest not found</div>

export const Success = ({ subjectAccessRequest }) => {
  return <SubjectAccessRequest subjectAccessRequest={subjectAccessRequest} />
}
