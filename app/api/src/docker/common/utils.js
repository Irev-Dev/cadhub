const { exec } = require('child_process')
const { promises } = require('fs')
const { writeFile } = promises
const { createHash } = require('crypto')

async function writeFiles(files = [], tempFile) {
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

async function runCommand(command, timeout = 5000) {
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

function loggerWrap(handler) {
  return (req, _context, callback) => {
    try {
      return handler(req, _context, callback)
    } catch (e) {
      console.log('error in handler', e)
    }
  }
}

async function storeAssetAndReturnUrl({
  error,
  callback,
  fullPath,
  consoleMessage,
  key,
  s3,
  params,
  tk,
}) {
  if (error) {
    const response = {
      statusCode: 400,
      body: JSON.stringify({ error, fullPath }),
    }
    callback(null, response)
    return
  } else {
    console.log(`got result in route: ${consoleMessage}, file is: ${fullPath}`)
    const { readFile } = require('fs/promises')
    let buffer

    try {
      buffer = await readFile(fullPath)
    } catch (e) {
      console.log('read file error', e)
      const response = {
        statusCode: 400,
        body: JSON.stringify({ error: consoleMessage, fullPath }),
      }
      callback(null, response)
      return
    }
    const FiveDays = 432000
    const storedRender = await s3
      .putObject({
        Bucket: process.env.BUCKET,
        Key: key,
        Body: buffer,
        CacheControl: `max-age=${FiveDays}`, // browser caching to stop downloads of the same part
        ContentType: 'text/stl',
        ContentEncoding: 'gzip',
      })
      .promise()
    console.log('stored object', storedRender)
    const url = getObjectUrl(params, s3, tk)
    console.log('url', url)
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        url,
      }),
    }
    callback(null, response)
    return
  }
}

module.exports = {
  runCommand,
  writeFiles,
  makeHash,
  checkIfAlreadyExists,
  getObjectUrl,
  loggerWrap,
  storeAssetAndReturnUrl,
}
