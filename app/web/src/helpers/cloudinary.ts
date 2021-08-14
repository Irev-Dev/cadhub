// TODO: create a tidy util for uploading to Cloudinary and returning the public ID
import axios from 'axios'

const CLOUDINARY_UPLOAD_PRESET = 'CadHub_project_images'
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/irevdev/upload'

export async function uploadToCloudinary(
  imgBlob: Blob,
  publicId?: string
): Promise<{ public_id: string }> {
  const imageData = new FormData()
  imageData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
  imageData.append('file', imgBlob)
  if (publicId) {
    imageData.append('public_id', publicId)
  }
  const upload = axios.post(CLOUDINARY_UPLOAD_URL, imageData)

  try {
    const { data } = await upload
    if (data && data.public_id !== '') {
      return data
    }
  } catch (e) {
    console.error('ERROR', e)
  }
}

export async function serverVerifiedImageUpload(
  imgBlob: string,
  projectId: string,
  token: string,
  publicId?: string
): Promise<{ publicId: string }> {
  const imageData = {
    image64: imgBlob,
    upload_preset: CLOUDINARY_UPLOAD_PRESET,
    public_id: publicId,
    invalidate: true,
    projectId,
  }
  const upload = axios.post('/.netlify/functions/image-upload', imageData, {
    headers: {
      'auth-provider': 'goTrue',
      authorization: `Bearer ${token}`,
    },
  })

  try {
    const { data } = await upload
    if (data && data.public_id !== '') {
      return data
    }
  } catch (e) {
    console.error('ERROR', e)
  }
}
