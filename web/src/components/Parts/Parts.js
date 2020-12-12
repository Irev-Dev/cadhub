import { Link, routes } from '@redwoodjs/router'

import { countEmotes } from 'src/helpers/emote'
import ImageUploader from 'src/components/ImageUploader'

const PartsList = ({ parts }) => {
  return (
    <section className="max-w-6xl mx-auto mt-20">
      <ul
        className="grid gap-x-8 gap-y-12 items-center mx-4 relative"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(16rem, 1fr))' }}
      >
        {parts.map(({ title, mainImage, user, Reaction }) => (
          <li
            className="rounded-lg shadow-md hover:shadow-lg mx-px transform hover:-translate-y-px transition-all duration-150"
            key={`${user?.userName}--${title}`}
          >
            <Link
              to={routes.part({ userName: user?.userName, partTitle: title })}
            >
              <div className="flex items-center p-2 bg-gray-200 border-gray-300 rounded-t-lg border-t border-l border-r">
                <div className="w-8 h-8 overflow-hidden rounded-full border border-indigo-300 shadow">
                  <ImageUploader
                    className=""
                    onImageUpload={() => {}}
                    aspectRatio={1}
                    imageUrl={user?.image}
                    width={50}
                  />
                </div>
                <span className="font-ropa-sans ml-3 text-lg text-indigo-900">
                  {title}
                </span>
              </div>
              <div className="w-full overflow-hidden relative rounded-b-lg">
                <ImageUploader
                  className=""
                  onImageUpload={() => {}}
                  aspectRatio={1.4}
                  imageUrl={mainImage}
                  width={700}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(19.04deg, rgba(62, 44, 118, 0.46) 10.52%, rgba(60, 54, 107, 0) 40.02%)',
                  }}
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 -mb-4 mr-4 flex justify-end">
                {countEmotes(Reaction).map(({ emoji, count }) => (
                  <div
                    key={emoji}
                    className="h-8 w-8 overflow-hidden ml-2 p-1 rounded-full bg-opacity-75 bg-gray-200 border border-gray-300 shadow-md flex items-center justify-between"
                  >
                    <div className="-ml-px text-sm w-1">{emoji}</div>
                    <div className="text-sm pl-1 font-ropa-sans text-gray-800">
                      {count}
                    </div>
                  </div>
                ))}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default PartsList
