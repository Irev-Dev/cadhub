import { useMutation, useFlash } from '@redwoodjs/web'
import { Link, routes } from '@redwoodjs/router'

import ImageUploader from 'src/components/ImageUploader'
const PartsList = ({ parts }) => {
  return (
    <section className="max-w-6xl mx-auto mt-20">
      <ul className="grid gap-8 items-center mx-4" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(16rem, 1fr))'}}>
        {parts.map(({title, mainImage, user}) => (
          <li className="rounded-lg overflow-hidden shadow-md hover:shadow-lg mx-px transform hover:-translate-y-px transition-all duration-150" key={`${user?.userName}--${title}`}><button className="w-full">
            <div className="flex items-center p-2 bg-gray-200 border-gray-300 rounded-t-lg border-t border-l border-r">
              <div className="w-8 h-8 overflow-hidden rounded-full border border-indigo-300 shadow max-w-xs">
                <ImageUploader
                  className=""
                  onImageUpload={() => {}}
                  aspectRatio={1}
                  imageUrl={user?.image}
                  width={50}
                />
              </div>
              <span className="font-ropa-sans ml-3 text-lg text-indigo-900">{title}</span>
            </div>
            <div className="w-full overflow-hidden relative">
              <ImageUploader
                className=""
                onImageUpload={() => {}}
                aspectRatio={1.4}
                imageUrl={mainImage}
                width={700}
              />
              <div className="absolute inset-0" style={{background: 'linear-gradient(19.04deg, rgba(62, 44, 118, 0.46) 10.52%, rgba(60, 54, 107, 0) 40.02%)'}} />
            </div>
            </button></li>
        ))}
      </ul>
    </section>
  )
}

export default PartsList
