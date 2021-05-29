const { makeFile, runCommand } = require('../common/utils')
const { nanoid } = require('nanoid')

/** Removes our generated/hash filename with just "main.scad", so that it's a nice message in the IDE */
const cleanOpenScadError = (error) =>
  error.replace(/["|']\/tmp\/.+\/main.scad["|']/g, "'main.scad'")

module.exports.runScad = async ({
  file,
  settings: {
    size: { x = 500, y = 500 } = {},
    camera: {
      position = { x: 40, y: 40, z: 40 },
      rotation = { x: 55, y: 0, z: 25 },
      dist = 200,
    } = {},
  } = {}, // TODO add view settings
} = {}) => {
  const tempFile = await makeFile(file, '.scad', nanoid)
  const { x: rx, y: ry, z: rz } = rotation
  const { x: px, y: py, z: pz } = position
  const cameraArg = `--camera=${px},${py},${pz},${rx},${ry},${rz},${dist}`
  const fullPath = `/tmp/${tempFile}/output.png`
  const command = `xvfb-run --auto-servernum --server-args "-screen 0 1024x768x24" openscad -o ${fullPath} ${cameraArg} --imgsize=${x},${y} --colorscheme DeepOcean /tmp/${tempFile}/main.scad`
  console.log('command', command)

  try {
    const consoleMessage = await runCommand(command, 15000)
    return { consoleMessage, fullPath }
  } catch (dirtyError) {
    const error = cleanOpenScadError(dirtyError)
    return { error }
  }
}

module.exports.stlExport = async ({ file } = {}) => {
  const tempFile = await makeFile(file, '.scad', nanoid)
  const fullPath = `/tmp/${tempFile}/output.stl`

  try {
    const consoleMessage = await runCommand(
      `xvfb-run --auto-servernum --server-args "-screen 0 1024x768x24" openscad -o ${fullPath} /tmp/${tempFile}/main.scad`,
      60000 // lambda will time out before this, we might need to look at background jobs if we do git integration stl generation
    )
    return { consoleMessage, fullPath }
  } catch (error) {
    return { error, fullPath }
  }
}
