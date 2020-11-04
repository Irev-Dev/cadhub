import UserProfile from 'src/components/UserProfile'

export const QUERY = gql`
  query FIND_USER_BY_ID($userName: String!) {
    user: userName(userName: $userName) {
      id
      userName
      email
      createdAt
      updatedAt
      image
      bio
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => <div>Error: {error.message}</div>

export const Success = ({ user }) => {
  return <UserProfile user={user} isEditable />
}
