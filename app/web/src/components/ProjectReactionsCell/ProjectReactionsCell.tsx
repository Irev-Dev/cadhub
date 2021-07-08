import ProjectReactions from 'src/components/ProjectReactions/ProjectReactions'

export const QUERY = gql`
  query ProjectReactionsQuery($projectId: String!) {
    projectReactionsByProjectId(projectId: $projectId) {
      id
      emote
      user {
        id
        userName
        image
      }
      updatedAt
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => (
  <div className="text-center py-8 font-roboto text-gray-700">
    No reactions to this project yet 😕
  </div>
)

export const Failure = ({ error }) => <div>Error: {error.message}</div>

export const Success = ({ projectReactionsByProjectId }) => {
  return <ProjectReactions reactions={projectReactionsByProjectId} />
}
