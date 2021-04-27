const { makeFile, runCommand } = require('../common/utils')
const { nanoid } = require('nanoid')

module.exports.runCQ = async ({ file, settings = {} } = {}) => {
  const tempFile = await makeFile(file, '.py', nanoid)
  const command = `cq-cli/cq-cli --codec stl --infile /tmp/${tempFile}/main.py --outfile /tmp/${tempFile}/output.stl`
  console.log('command', command)

  try {
    const result = await runCommand(command, 30000)
    return { result, tempFile }
  } catch (error) {
    return { error, tempFile }
  }
}
