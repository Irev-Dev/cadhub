import { useMemo } from 'react'
import { Link, routes } from '@redwoodjs/router'
import Svg from 'src/components/Svg/Svg'
import CadPackage from 'src/components/CadPackage/CadPackage'

import { countEmotes } from 'src/helpers/emote'
import ImageUploader from 'src/components/ImageUploader'
import ProjectCard from 'src/components/ProjectCard/ProjectCard'

const ProjectsList = ({
  projects,
  shouldFilterProjectsWithoutImage = false,
  projectLimit = 80,
  isMinimal = false,
}) => {
  // temporary filtering projects that don't have images until some kind of search is added and there are more things on the website
  // it helps avoid the look of the website just being filled with dumby data.
  // related issue-104

  // note to self the projectCard is hardcoded directly into this component will not be hard the extract later when we need it elsewhere.
  const filteredProjects = useMemo(
    () =>
      (shouldFilterProjectsWithoutImage
        ? projects
            .filter(({ mainImage }) => mainImage)
            .slice(0, projectLimit || 80)
        : [...projects].slice(0, projectLimit || 80)
      )
        // sort should probably be done on the service, but the filtering is temp too
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        ),
    [projects, shouldFilterProjectsWithoutImage]
  )

  return !isMinimal ? (
    <section className="max-w-7xl mx-auto">
      <ul
        className="grid gap-x-8 gap-y-8 items-center relative"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(16rem, 1fr))' }}
      >
        {filteredProjects.map(
          (
            { title, mainImage, user, Reaction, cadPackage, childForks },
            index
          ) => (
            <ProjectCard
              key={index}
              title={title}
              mainImage={mainImage}
              user={user}
              Reaction={Reaction}
              cadPackage={cadPackage}
              childForks={childForks}
              key={`project-card-${index}`}
            />
          )
        )}
      </ul>
    </section>
  ) : (
    <section>
      <ul>
        {filteredProjects.map(({ title, user }, index) => (
          <Link
            to={routes.project({
              userName: user?.userName,
              projectTitle: title,
            })}
            className="my-2 capitalize block hover:text-ch-pink-300"
            key={`project-item-${index}`}
          >
            <p>{title.replace(/[-_]/g, ' ')}</p>
          </Link>
        ))}
      </ul>
    </section>
  )
}

export default ProjectsList
