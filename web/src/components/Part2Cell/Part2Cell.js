import { useMutation, useFlash } from '@redwoodjs/web'
import { navigate, routes } from '@redwoodjs/router'

import PartProfile from 'src/components/PartProfile'

export const QUERY = gql`
  query FIND_PART_BY_USERNAME_TITLE($userName: String!, $partTitle: String!) {
    userPart: userName(userName: $userName) {
      name
      userName
      bio
      image
      id
      Part(partTitle: $partTitle) {
        id
        title
        description
        code
        mainImage
        createdAt
        updatedAt
        userId
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => <div>Error: {error.message}</div>

export const Success = ({ userPart, variables: {isEditable} }) => {
  return <PartProfile userPart={userPart} isEditable={isEditable} />
}
