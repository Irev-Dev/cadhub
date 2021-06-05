import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { navigate, routes } from '@redwoodjs/router'
import IdeCascadeStudio from 'src/components/IdeCascadeStudio'
import { QUERY as UsersPartsQuery } from 'src/components/PartsOfUserCell'
import useUser from 'src/helpers/hooks/useUser'

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
        userName
        image
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
export const FORK_PART_MUTATION = gql`
  mutation ForkPartMutation($input: CreatePartInput!) {
    forkPart(input: $input) {
      id
      title
      user {
        userName
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Part not found</div>

export const Success = ({ part, refetch }) => {
  const { user } = useUser()
  const [updatePart, { loading, error }] = useMutation(UPDATE_PART_MUTATION, {
    onCompleted: () => {
      toast.success('Part updated.')
    },
  })
  const [forkPart] = useMutation(FORK_PART_MUTATION, {
    refetchQueries: [
      {
        query: UsersPartsQuery,
        variables: { userName: user?.userName },
      },
    ],
    onCompleted: ({ forkPart }) => {
      navigate(
        routes.ide({
          userName: forkPart?.user?.userName,
          partTitle: forkPart?.title,
        })
      )
      toast.success('Part Forked.')
    },
  })

  const saveCode = async ({ input, id, isFork }) => {
    if (!isFork) {
      await updatePart({ variables: { id, input } })
      refetch()
      return
    }
    forkPart({ variables: { input } })
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
