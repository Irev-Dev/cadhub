import { useQuery } from '@redwoodjs/web'
import { useAuth } from '@redwoodjs/auth'

const QUERY = gql`
  query FIND_USER_BY_ID($id: String!) {
    user: user(id: $id) {
      id
      image
      userName
      name
    }
  }
`

export default function () {
  const { currentUser } = useAuth()
  const { data, loading } = useQuery(QUERY, {
    skip: !currentUser?.sub,
    variables: { id: currentUser?.sub },
  })
  return { user: data?.user, loading }
}
