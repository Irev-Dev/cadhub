import { useState } from 'react'
import { Image as CloudinaryImage } from 'cloudinary-react'

interface Props {
  image: string
  className?: string
}

const Gravatar = ({ image, className = '' }: Props) => {
  return (
    <div
      className={
        'aspect-h-1 rounded-full overflow-hidden border-2 border-gray-200 ' +
        className
      }
    >
      <CloudinaryImage
        cloudName="irevdev"
        publicId={image || 'CadHub/eia1kwru54g2kf02s2xx'}
        width={40}
        crop="scale"
      />
    </div>
  )
}

export default Gravatar
