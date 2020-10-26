import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Button from "@material-ui/core/Button";
import axios from 'axios'
import ReactCrop from 'react-image-crop'
import { Dialog } from '@material-ui/core'
import 'react-image-crop/dist/ReactCrop.css'

const CLOUDINARY_UPLOAD_PRESET = process.env.GATSBY_PROD_PRESET || "dev_preset";
const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/irevdev/upload";

export default function ImageUploader({ onImageUpload }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [file, setFile] = useState()
  const [crop, setCrop] = useState({
    aspect: 16 / 9,
    unit: '%',
    width: 100,
  });
  async function handleImageUpload() {
    var image = new Image();
    image.src = file
    const croppedFile = await getCroppedImg(image, crop, 'avatar')
    console.log(croppedFile)
    const imageData = new FormData();
    imageData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    imageData.append('file', croppedFile);
    let upload = axios.post(CLOUDINARY_UPLOAD_URL, imageData)
    try {
      const { data } = await upload
      if (data && data.public_id !== "") {
        onImageUpload({cloudinaryPublicId: data.public_id})
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
    <div>
      <div className="w-full relative" {...getRootProps()}>
        <input {...getInputProps()} />
          {/* <Button className variant="outlined">Upload</Button> */}
        <button className="absolute inset-0"></button>
        <div className="mt-3 text-indigo-500 border-dashed border border-indigo-500 py-8 text-center rounded-lg w-full">
            Drop files here ...
            or <span className="group flex w-full items-center justify-center">
              <span className="bg-indigo-500 shadow rounded text-gray-200 cursor-pointer p-2 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-150">upload</span>
            </span>
        </div>
      </div>
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="p-4">
          <ReactCrop src={file} crop={crop} onChange={newCrop => setCrop(newCrop)} />
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
    crop.height,
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
