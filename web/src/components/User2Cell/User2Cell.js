import UserProfile from 'src/components/UserProfile'

export const QUERY = gql`
  query FIND_USER_BY_ID($userName: String!) {
    user: userName(userName: $userName) {
      id
      userName
      name
      createdAt
      updatedAt
      image
      bio
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>User not found</div>

export const Success = ({user}) => {
  return <UserProfile user={user} />
}
