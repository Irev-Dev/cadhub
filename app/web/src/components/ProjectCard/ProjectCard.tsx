import { Link, routes } from '@redwoodjs/router'
import Svg from 'src/components/Svg/Svg'
import CadPackage from 'src/components/CadPackage/CadPackage'

import { countEmotes } from 'src/helpers/emote'
import ImageUploader from 'src/components/ImageUploader'

const ProjectCard = ({ title, mainImage, user, Reaction, cadPackage }) => (
  <li
    className="rounded p-1.5 bg-ch-gray-760 shadow-ch"
    key={`${user?.userName}--${title}`}
  >
    <Link
      to={routes.project({
        userName: user?.userName,
        projectTitle: title,
      })}
    >
      <div className="relative">
        <ImageUploader
          className="rounded"
          aspectRatio={1.4}
          imageUrl={mainImage}
          width={700}
        />
        <CadPackage
          cadPackage={cadPackage}
          className="absolute right-0 top-0 p-1.5 rounded-bl text-sm bg-opacity-50"
          dotClass="w-3 h-3"
        />
      </div>
      <div className="flex items-center mt-1">
        <div className="w-8 h-8 overflow-hidden rounded-full border border-ch-gray-300 shadow">
          <ImageUploader
            className=""
            aspectRatio={1}
            imageUrl={user?.image}
            width={50}
          />
        </div>
        <div className="ml-3 text-lg text-ch-gray-300 font-fira-sans">
          <div className="">{title}</div>
          <div className="text-sm">{user?.userName}</div>
        </div>
      </div>
      <div className="grid grid-flow-col-dense gap-2 justify-start mt-1.5">
        <div className="px-2 flex items-center bg-ch-gray-600 text-ch-gray-300 rounded-sm">
          <Svg name="reactions" className="w-4 mr-2" />
          {countEmotes(Reaction).reduce((prev, { count }) => prev + count, 0)}
        </div>
        <div className="px-2 flex items-center bg-ch-blue-650 bg-opacity-30 text-ch-gray-300 rounded-sm">
          <Svg name="fork-new" className="w-4 mr-2" />0
        </div>
      </div>
    </Link>
  </li>
)

export default ProjectCard
