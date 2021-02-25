// TODO: create a tidy util for uploading to Cloudinary and returning the public ID
import axios from 'axios'

const CLOUDINARY_UPLOAD_PRESET = 'CadHub_project_images'
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/irevdev/upload'

export async function uploadToCloudinary(imgBlob) {
  // const imageData = new FormData()
  // imageData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
  // imageData.append('file', croppedFile)
  // let upload = axios.post(CLOUDINARY_UPLOAD_URL, imageData)

  // try {
  //   const { data } = await upload
  //   if (data && data.public_id !== '') {
  //     onImageUpload({ cloudinaryPublicId: data.public_id })
  //     setCloudinaryId(data.public_id)
  //     setIsModalOpen(false)
  //   }
  // } catch (e) {
  //   console.error('ERROR', e)
  // }
}