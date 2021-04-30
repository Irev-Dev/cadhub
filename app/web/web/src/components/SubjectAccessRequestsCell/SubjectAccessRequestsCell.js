import SubjectAccessRequests from 'src/components/SubjectAccessRequests'

export const QUERY = gql`
  query SUBJECT_ACCESS_REQUESTS {
    subjectAccessRequests {
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

export const Empty = () => {
  return <div className="rw-text-center">No subjectAccessRequests yet.</div>
}

export const Success = ({ subjectAccessRequests }) => {
  return <SubjectAccessRequests subjectAccessRequests={subjectAccessRequests} />
}
