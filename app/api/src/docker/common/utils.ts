const { exec } = require('child_process')
const { promises } = require('fs')
const { writeFile } = promises
const { createHash } = require('crypto')
import { readFile } from 'fs/promises'

export async function writeFiles(
  files: { file: string; fileName: string }[] = [],
  tempFile: string
): Promise<string> {
  console.log(`file to write: ${files.length}`)

  try {
    await runCommand(`mkdir /tmp/${tempFile}`)
  } catch (e) {
    //
  }
  await Promise.all(
    files.map(({ file, fileName }) =>
      writeFile(`/tmp/${tempFile}/${fileName}`, file)
    )
  )
  return tempFile
}

export async function runCommand(command, timeout = 5000, shouldRejectStdErr = false): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`)
        console.log(`stderr: ${stderr}`)
        console.log(`stdout: ${stdout}`)
        reject(stdout || stderr) // it seems random if the message is in stdout or stderr, but not normally both
        return
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`)
        if (shouldRejectStdErr) {
          reject(stderr)
          return
        }
        resolve(stderr)
        return
      }
      console.log(`stdout: ${stdout}`)
      resolve(stdout)
    })
    setTimeout(() => {
      reject('timeout')
    }, timeout)
  })
}

function makeHash(script) {
  return createHash('sha256').update(script).digest('hex')
}

async function checkIfAlreadyExists(params, s3) {
  try {
    await s3.headObject(params).promise()
    return { isAlreadyInBucket: true }
  } catch (e) {
    console.log("couldn't find it", e)
    return { isAlreadyInBucket: false }
  }
}

function getObjectUrl(params, s3, tk) {
  const getTruncatedTime = () => {
    const currentTime = new Date()
    const d = new Date(currentTime)

    d.setMinutes(Math.floor(d.getMinutes() / 10) * 10)
    d.setSeconds(0)
    d.setMilliseconds(0)

    return d
  }
  const HALF_HOUR = 1800
  return tk.withFreeze(getTruncatedTime(), () =>
    s3.getSignedUrl('getObject', {
      ...params,
      Expires: HALF_HOUR,
    })
  )
}

export function loggerWrap(handler) {
  return (req, _context, callback) => {
    try {
      return handler(req, _context, callback)
    } catch (e) {
      console.log('error in handler', e)
    }
  }
}

export async function storeAssetAndReturnUrl({
  error,
  callback,
  fullPath,
  consoleMessage,
}: {
  error: string
  callback: Function
  fullPath: string
  consoleMessage: string
}) {
  if (error) {
    const response = {
      statusCode: 400,
      body: Buffer.from(JSON.stringify({ error, fullPath })).toString('base64'),
      isBase64Encoded: true,
    }
    callback(null, response)
    return
  } else {
    console.log(`got result in route: ${consoleMessage}, file is: ${fullPath}`)
    let buffer = ''

    try {
      buffer = await readFile(fullPath, { encoding: 'base64' })
    } catch (e) {
      console.log('read file error', e)
      const response = {
        statusCode: 400,
        body: Buffer.from(JSON.stringify({ error: consoleMessage, fullPath })).toString('base64'),
        isBase64Encoded: true,
      }
      callback(null, response)
      return
    }
    const response = {
      statusCode: 200,
      body: buffer,
      isBase64Encoded: true,
      headers: {
        'Content-Type': 'application/javascript',
        'Content-Encoding': 'gzip',
      },
    }
    callback(null, response)
    return
  }
}
