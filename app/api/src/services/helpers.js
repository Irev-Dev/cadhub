import { v2 as cloudinary } from 'cloudinary'
cloudinary.config({
  cloud_name: 'irevdev',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const foreignKeyReplacement = (input) => {
  let output = input
  const foreignKeys = Object.keys(input).filter((k) => k.match(/Id$/))
  foreignKeys.forEach((key) => {
    const modelName = key.replace(/Id$/, '')
    const value = input[key]
    delete output[key]
    output = Object.assign(output, {
      [modelName]: { connect: { id: value } },
    })
  })
  return output
}

export const enforceAlphaNumeric = (string) =>
  (string || '').replace(/([^a-zA-Z\d_:])/g, '-')

export const generateUniqueString = async (
  seed,
  isUniqueCallback,
  count = 0
) => {
  const isUnique = !(await isUniqueCallback(seed))
  if (isUnique) {
    return seed
  }
  count += 1
  const newSeed = count === 1 ? `${seed}_${count}` : seed.slice(0, -1) + count
  return generateUniqueString(newSeed, isUniqueCallback, count)
}

export const destroyImage = ({ publicId }) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        reject(error)
        return
      }
      resolve(result)
    })
  })
