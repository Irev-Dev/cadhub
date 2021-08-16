import {
  v2 as cloudinary,
  UploadApiResponse,
  UpdateApiOptions,
} from 'cloudinary'

cloudinary.config({
  cloud_name: 'irevdev',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

interface UploadImageArgs {
  image64: string
  uploadPreset?: string
  publicId?: string
  invalidate: boolean
}

export const uploadImage = async ({
  image64,
  uploadPreset = 'CadHub_project_images',
  publicId,
  invalidate = true,
}: UploadImageArgs): Promise<UploadApiResponse> => {
  const options: UpdateApiOptions = { upload_preset: uploadPreset, invalidate }
  if (publicId) {
    options.public_id = publicId
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(image64, options, (error, result) => {
      if (error) {
        reject(error)
        return
      }
      resolve(result)
    })
  })
}

export const makeSocialPublicIdServer = (
  userName: string,
  projectTitle: string
): string => `u-${userName}-slash-p-${projectTitle}`
