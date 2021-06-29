const { makeFile, runCommand } = require('../common/utils')
const { nanoid } = require('nanoid')

module.exports.runCQ = async ({
  file,
  settings: { deflection = 0.3 } = {},
} = {}) => {
  const tempFile = await makeFile(file, '.py', nanoid)
  const fullPath = `/tmp/${tempFile}/output.stl`
  const command = `cq-cli/cq-cli --codec stl --infile /tmp/${tempFile}/main.py --outfile ${fullPath} --outputopts "deflection:${deflection};angularDeflection:${deflection};"`
  console.log('command', command)

  try {
    const consoleMessage = await runCommand(command, 30000)
    return { consoleMessage, fullPath }
  } catch (error) {
    return { error, fullPath }
  }
}
