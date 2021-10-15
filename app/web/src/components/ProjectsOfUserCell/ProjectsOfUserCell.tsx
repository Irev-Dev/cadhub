import type { Projects_Of_User } from 'types/graphql'
import Projects from 'src/components/Projects/Projects'
export const QUERY = gql`
  query PROJECTS_OF_USER($userName: String!) {
    projects(userName: $userName) {
      id
      title
      mainImage
      cadPackage
      childForks {
        id
      }
      createdAt
      updatedAt
      user {
        id
        image
        userName
      }
      Reaction {
        id
        emote
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = ({ isMinimal = false }) => {
  return (
    <p className={`${isMinimal && 'my-2 text-ch-gray-400'}`}>
      No projects yet.
    </p>
  )
}

export const Success = ({
  projects,
  shouldFilterProjectsWithoutImage = false,
  projectLimit = 80,
}: {
  projects: Projects_Of_User['projects']
  shouldFilterProjectsWithoutImage: boolean
  projectLimit: number
}) => {
  return (
    <Projects
      projects={projects}
      shouldFilterProjectsWithoutImage={shouldFilterProjectsWithoutImage}
      projectLimit={projectLimit}
    />
  )
}
