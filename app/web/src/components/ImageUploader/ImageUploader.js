import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Button from '@material-ui/core/Button'
import axios from 'axios'
import ReactCrop from 'react-image-crop'
import { Dialog } from '@material-ui/core'
import { Image as CloudinaryImage } from 'cloudinary-react'
import 'react-image-crop/dist/ReactCrop.css'
import Svg from 'src/components/Svg'

const CLOUDINARY_UPLOAD_PRESET = 'CadHub_project_images'
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/irevdev/upload'

export function ImageFallback({
  width = 100,
  imageId = 'CadHub/eia1kwru54g2kf02s2xx',
  className = '',
}) {
  return (
    <div className="relative overflow-hidden w-full h-full">
      <CloudinaryImage
        className={
          'object-cover w-full h-full shadow overflow-hidden ' + className
        }
        cloudName="irevdev"
        publicId={imageId}
        width={width}
        crop="scale"
      />
    </div>
  )
}

export default function ImageUploader({
  onImageUpload = () => {},
  imageUrl,
  aspectRatio,
  className,
  isEditable,
  width = 600,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [file, setFile] = useState()
  const [cloudinaryId, setCloudinaryId] = useState(imageUrl)
  const [imageObj, setImageObj] = useState()
  const [crop, setCrop] = useState({
    aspect: aspectRatio,
    unit: '%',
    width: 100,
  })
  async function handleImageUpload() {
    const croppedFile = await getCroppedImg(imageObj, crop, 'avatar')
    const imageData = new FormData()
    imageData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
    imageData.append('file', croppedFile)
    let upload = axios.post(CLOUDINARY_UPLOAD_URL, imageData)
    try {
      const { data } = await upload
      if (data && data.public_id !== '') {
        onImageUpload({ cloudinaryPublicId: data.public_id })
        setCloudinaryId(data.public_id)
        setIsModalOpen(false)
      }
    } catch (e) {
      console.error('ERROR', e)
    }
  }
  // Drag and Drop
  const onDrop = useCallback((acceptedFiles) => {
    setIsModalOpen(true)
    const fileReader = new FileReader()
    fileReader.onload = () => {
      setFile(fileReader.result)
    }
    fileReader.readAsDataURL(acceptedFiles[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })
  return (
    <div
      className={
        'relative overflow-hidden ' +
        (!imageUrl && isEditable ? 'border ' : '') +
        className
      }
      style={{ paddingBottom: `${(1 / aspectRatio) * 100}%` }}
    >
      <div className="absolute w-full h-full inset-0" {...getRootProps()}>
        {cloudinaryId && isEditable && (
          <button className="w-full py-1 absolute z-10 bg-ch-blue-650 bg-opacity-50 hover:bg-opacity-80 bottom-0 right-0 left-0 flex items-center justify-center text-ch-gray-300">
            <span className="font-fira-code text-sm leading-4">Update</span>
            <Svg name="pencil-solid" className=" h-4 w-4 ml-4 mb-2" />
          </button>
        )}
        {isEditable && <input {...getInputProps()} />}
        {(cloudinaryId || !isEditable) && (
          <ImageFallback imageId={cloudinaryId} width={width} />
        )}
        {!cloudinaryId && <button className="absolute inset-0"></button>}
        {!cloudinaryId && isEditable && (
          <div className="text-ch-blue-400 flex items-center justify-center rounded-lg w-full h-full">
            <div className="px-2 text-sm text-center">
              Drop files here or{' '}
              <span className="group flex w-full items-center justify-center pt-2">
                <span className="text-base bg-ch-blue-400 rounded-sm text-ch-gray-300 cursor-pointer px-3 py-2 leading-4 bg-ch-blue-700 bg-opacity-60 hover:bg-opacity-90">
                  upload
                </span>
              </span>
            </div>
          </div>
        )}
      </div>
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-4">
          <ReactCrop
            src={file}
            crop={crop}
            onImageLoaded={(image) => setImageObj(image)}
            onChange={(newCrop) => setCrop(newCrop)}
          />
          <Button onClick={handleImageUpload} variant="outlined">
            Upload
          </Button>
        </div>
      </Dialog>
    </div>
  )
}

function getCroppedImg(image, crop, fileName) {
  const canvas = document.createElement('canvas')
  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height
  canvas.width = crop.width
  canvas.height = crop.height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  )

  // As Base64 string
  // const base64Image = canvas.toDataURL('image/jpeg');

  // As a blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        blob.name = fileName
        resolve(blob)
      },
      'image/jpeg',
      1
    )
  })
}
