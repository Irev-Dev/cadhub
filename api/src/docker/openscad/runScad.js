const { exec } = require('child_process')
const { promises } = require('fs')
const { writeFile } = promises
const { nanoid } = require('nanoid')

module.exports.runScad = async ({
  file,
  settings: {
    size: { x = 500, y = 500 } = {},
    camera: {
      position = { x: 40, y: 40, z: 40 },
      rotation = { x: 55, y: 0, z: 25 },
    } = {},
  } = {}, // TODO add view settings
} = {}) => {
  const tempFile = await makeFile(file)
  const { x: rx, y: ry, z: rz } = rotation
  const { x: px, y: py, z: pz } = position
  const cameraArg = `--camera=${px},${py},${pz},${rx},${ry},${rz},300`
  const command = `xvfb-run --auto-servernum --server-args "-screen 0 1024x768x24" openscad -o /tmp/${tempFile}/output.png ${cameraArg} --imgsize=${x},${y} /tmp/${tempFile}/main.scad`
  console.log('command', command)

  try {
    const result = await runCommand(command, 10000)
    return { result, tempFile }
  } catch (error) {
    return { error, tempFile }
  }
}

module.exports.stlExport = async ({ file } = {}) => {
  const tempFile = await makeFile(file)

  try {
    const result = await runCommand(
      `openscad -o /tmp/${tempFile}/output.stl /tmp/${tempFile}/main.scad`,
      300000 // lambda will time out before this, we might need to look at background jobs if we do git integration stl generation
    )
    return { result, tempFile }
  } catch (error) {
    return { error, tempFile }
  }
}

async function makeFile(file) {
  const tempFile = 'a' + nanoid() // 'a' ensure nothing funny happens if it start with a bad character like "-", maybe I should pick a safer id generator :shrug:
  console.log(`file to write: ${file}`)

  await runCommand(`mkdir /tmp/${tempFile}`)
  await writeFile(`/tmp/${tempFile}/main.scad`, file)
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
        resolve(`stderr: ${stderr}`)
        return
      }
      console.log(`stdout: ${stdout}`)
      resolve(`stdout: ${stdout}`)
    })
    setTimeout(() => {
      reject('timeout')
    }, timeout)
  })
}
