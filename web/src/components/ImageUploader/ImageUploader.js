import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Button from "@material-ui/core/Button";
import axios from 'axios'
import ReactCrop from 'react-image-crop'
import { Dialog } from '@material-ui/core'
import { Image as CloudinaryImage } from 'cloudinary-react'
import 'react-image-crop/dist/ReactCrop.css'
import Svg from 'src/components/Svg/Svg.js'

const CLOUDINARY_UPLOAD_PRESET = "CadHub_project_images";
const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/irevdev/upload";

export default function ImageUploader({ onImageUpload, imageUrl, aspectRatio, className, isEditable }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [file, setFile] = useState()
  const [cloudinaryId, setCloudinaryId] = useState(imageUrl)
  const [imageObj, setImageObj] = useState()
  const [crop, setCrop] = useState({
    aspect: aspectRatio,
    unit: '%',
    width: 100,
  });
  async function handleImageUpload() {
    const croppedFile = await getCroppedImg(imageObj, crop, 'avatar')
    console.log(croppedFile)
    const imageData = new FormData();
    imageData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    imageData.append('file', croppedFile);
    let upload = axios.post(CLOUDINARY_UPLOAD_URL, imageData)
    try {
      const { data } = await upload
      if (data && data.public_id !== "") {
        onImageUpload({cloudinaryPublicId: data.public_id})
        setCloudinaryId(data.public_id)
        setIsModalOpen(false)
      }
    } catch (e) {
      console.error('ERROR', e)
    }
  }
  // Drag and Drop
  const onDrop = useCallback(acceptedFiles => {
    setIsModalOpen(true)
    const fileReader = new FileReader()
    fileReader.onload = () => {
      setFile(fileReader.result)
    }
    fileReader.readAsDataURL(acceptedFiles[0])
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <div className={'relative overflow-hidden '+ (!imageUrl && isEditable ? 'border ' : '') + className} style={{paddingBottom: `${1/aspectRatio*100}%`}}>
      <div className="absolute w-full h-full" {...getRootProps()}>
        {cloudinaryId && isEditable && <button className="absolute z-10 w-full inset-0 bg-indigo-900 opacity-50 flex justify-center items-center">
          <Svg name="pencil" strokeWidth={2} className="text-gray-300 h-48 w-48" />
        </button>}
        {isEditable && <input {...getInputProps()} />}
        {(cloudinaryId || !isEditable) && <div className="relative overflow-hidden w-full h-full">
          <CloudinaryImage
            className="object-cover w-full h-full rounded shadow overflow-hidden"
            cloudName="irevdev"
            publicId={cloudinaryId || 'CadHub/eia1kwru54g2kf02s2xx'}
            width="600"
            crop="scale"
          />
        </div>}
        {!cloudinaryId && <button className="absolute inset-0"></button>}
        {!cloudinaryId && isEditable && <div className="text-indigo-500 flex items-center justify-center rounded-lg w-full h-full">
          <div className="px-6 text-center">
            Drop files here ...
            or <span className="group flex w-full items-center justify-center py-2">
              <span className="bg-indigo-500 shadow rounded text-gray-200 cursor-pointer p-2 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-150">upload</span>
            </span>
          </div>
        </div>}
      </div>
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="p-4">
          <ReactCrop src={file} crop={crop} onImageLoaded={(image) => setImageObj(image)} onChange={newCrop => setCrop(newCrop)} />
          <Button onClick={handleImageUpload} variant="outlined">Upload</Button>
        </div>
      </Dialog>
    </div>
  );
}

function getCroppedImg(image, crop, fileName) {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext('2d');
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
  );

  // As Base64 string
  // const base64Image = canvas.toDataURL('image/jpeg');

  // As a blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      blob.name = fileName;
      resolve(blob);
    }, 'image/jpeg', 1);
  });
}
