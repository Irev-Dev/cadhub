import { Link, routes } from '@redwoodjs/router'

import Projects from 'src/components/Projects/Projects'

export const QUERY = gql`
  query PROJECTS_OF_USER($userName: String!) {
    projects(userName: $userName) {
      id
      title
      mainImage
      createdAt
      updatedAt
      user {
        image
        userName
      }
      Reaction {
        emote
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return <div className="rw-text-center">No projects yet.</div>
}

export const Success = ({
  projects,
  variables: { shouldFilterProjectsWithoutImage },
}) => {
  return (
    <Projects
      projects={projects}
      shouldFilterProjectsWithoutImage={shouldFilterProjectsWithoutImage}
    />
  )
}
