import { writeFiles, runCommand } from '../common/utils'
import { nanoid } from 'nanoid'
import { readFile } from 'fs/promises'

export const runCQ = async ({
  file,
  settings: { deflection = 0.3, parameters } = {},
} = {}) => {
  const tempFile = await writeFiles(
    [
      { file, fileName: 'main.py' },
      {
        file: JSON.stringify(parameters),
        fileName: 'params.json',
      },
    ],
    'a' + nanoid() // 'a' ensure nothing funny happens if it start with a bad character like "-", maybe I should pick a safer id generator :shrug:
  )
  const fullPath = `/tmp/${tempFile}/output.gz`
  const stlPath = `/tmp/${tempFile}/output.stl`
  const customizerPath = `/tmp/${tempFile}/customizer.json`
  const mainCommand = [
    `./cq-cli/cq-cli.py`,
    `--codec stl`,
    `--infile /tmp/${tempFile}/main.py`,
    `--outfile ${stlPath}`,
    `--outputopts "deflection:${deflection};angularDeflection:${deflection};"`,
    `--params /tmp/${tempFile}/params.json`,
  ].join(' ')
  const customizerCommand = [
    `./cq-cli/cq-cli.py`,
    `--getparams true`,
    `--infile /tmp/${tempFile}/main.py`,
    `--outfile ${customizerPath}`,
    `--rawparamsoutfile /tmp/${tempFile}/params.json`
  ].join(' ')
  console.log('command', mainCommand)
  let consoleMessage = ''
  try {
    ;[consoleMessage] = await Promise.all([
      runCommand(mainCommand, 30000),
      runCommand(customizerCommand, 30000),
    ])
    const params = JSON.parse(
      await readFile(customizerPath, { encoding: 'ascii' })
    )
    await writeFiles(
      [
        {
          file: JSON.stringify({
            customizerParams: params,
            consoleMessage,
            type: 'stl',
          }),
          fileName: 'metadata.json',
        },
      ],
      tempFile
    )
    await runCommand(
      `cat ${stlPath} /var/task/cadhub-concat-split /tmp/${tempFile}/metadata.json | gzip > ${fullPath}`,
      15000,
      true
    )
    return { consoleMessage, fullPath }
  } catch (error) {
    return { error: consoleMessage || error, fullPath }
  }
}
