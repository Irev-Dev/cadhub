import type { APIGatewayEvent } from 'aws-lambda'
import { logger } from 'src/lib/logger'
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'
// import { requireOwnership } from 'src/lib/owner'
// import { requireAuth } from 'src/lib/auth'

cloudinary.config({
  cloud_name: 'irevdev',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

/**
 * The handler function is your code that processes http request events.
 * You can use return and throw to send a response or error, respectively.
 *
 * Important: When deployed, a custom serverless function is an open API endpoint and
 * is your responsibility to secure appropriately.
 *
 * @see {@link https://redwoodjs.com/docs/serverless-functions#security-considerations|Serverless Function Considerations}
 * in the RedwoodJS documentation for more information.
 *
 * @typedef { import('aws-lambda').APIGatewayEvent } APIGatewayEvent
 * @typedef { import('aws-lambda').Context } Context
 * @param { APIGatewayEvent } event - an object which contains information from the invoker.
 * @param { Context } context - contains information about the invocation,
 * function, and execution environment.
 */
export const handler = async (event: APIGatewayEvent, _context) => {
  logger.info('Invoked image-upload function')
  // requireAuth()
  const {
    image64,
    upload_preset,
    public_id,
    invalidate,
    projectId,
  }: {
    image64: string
    upload_preset: string
    public_id: string
    invalidate: boolean
    projectId: string
  } = JSON.parse(event.body)
  // await requireOwnership({projectId})

  const uploadResult: UploadApiResponse = await new Promise(
    (resolve, reject) => {
      cloudinary.uploader.upload(
        image64,
        { upload_preset, public_id, invalidate },
        (error, result) => {
          if (error) {
            reject(error)
            return
          }
          resolve(result)
        }
      )
    }
  )

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      publicId: uploadResult.public_id,
    }),
  }
}
