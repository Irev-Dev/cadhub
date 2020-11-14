import { useMutation, useFlash } from '@redwoodjs/web'
import { navigate, routes } from '@redwoodjs/router'
import IdeCascadeStudio from 'src/components/IdeCascadeStudio'
// import Part from 'src/components/Part'a

export const QUERY = gql`
  query FIND_PART_BY_USENAME_TITLE($partTitle: String!, $userName: String!) {
    part: partByUserAndTitle(partTitle: $partTitle, userName: $userName) {
      id
      title
      description
      code
      mainImage
      createdAt
      user {
        id
      }
    }
  }
`

const UPDATE_PART_MUTATION = gql`
  mutation UpdatePartMutation($id: String!, $input: UpdatePartInput!) {
    updatePart(id: $id, input: $input) {
      id
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Part not found</div>

export const Success = ({ part, refetch }) => {
  const { addMessage } = useFlash()
  const [updatePart, { loading, error }] = useMutation(UPDATE_PART_MUTATION, {
    onCompleted: () => {
      // navigate(routes.part({id: updatePart.id}))
      addMessage('Part updated.', { classes: 'rw-flash-success' })
    },
  })

  const saveCode = (input, id) => {
    updatePart({ variables: { id, input } })
    refetch()
  }
  return (
    <IdeCascadeStudio
      part={part}
      saveCode={saveCode}
      loading={loading}
      error={error}
    />
  )
}
