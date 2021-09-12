import { Link, routes } from '@redwoodjs/router'

import Projects from 'src/components/Projects/Projects'

export const QUERY = gql`
  query PROJECTS {
    projects {
      id
      title
      cadPackage
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
  return (
    <div className="rw-text-center">
      {'No projects yet. '}
      <Link to={routes.draftProject()} className="rw-link">
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Success = ({
  projects,
  variables: { shouldFilterProjectsWithoutImage, projectLimit },
}) => {
  return (
    <Projects
      projects={projects}
      shouldFilterProjectsWithoutImage={shouldFilterProjectsWithoutImage}
      projectLimit={projectLimit}
    />
  )
}
