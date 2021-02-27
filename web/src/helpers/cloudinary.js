// TODO: create a tidy util for uploading to Cloudinary and returning the public ID
import axios from 'axios'
import { threejsViewport } from 'src/cascade/js/MainPage/CascadeState'
import CascadeController from 'src/helpers/cascadeController'

const CLOUDINARY_UPLOAD_PRESET = 'CadHub_project_images'
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/irevdev/upload'

export async function uploadToCloudinary(imgBlob) {
  const imageData = new FormData()
  imageData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
  imageData.append('file', imgBlob)
  let upload = axios.post(CLOUDINARY_UPLOAD_URL, imageData)

  try {
    const { data } = await upload
    if (data && data.public_id !== '') {
      return data
    }
  } catch (e) {
    console.error('ERROR', e)
  }
}

export const captureAndSaveViewport = async () => {
  // Get the canvas image as a Data URL
  const imgBlob = await CascadeController.capture(threejsViewport.environment)

  // Upload the image to Cloudinary
  const { public_id: publicId } = await uploadToCloudinary(imgBlob)
  return { publicId, imgBlob }
}
