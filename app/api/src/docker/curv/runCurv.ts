import { writeFiles, runCommand } from '../common/utils'
import { nanoid } from 'nanoid'

export const runCurv = async ({
  file,
  settings: {
    size: { x = 500, y = 500 } = {},
    parameters,
  } = {}, // TODO add view settings
} = {}): Promise<{
  error?: string
  consoleMessage?: string
  fullPath?: string
  customizerPath?: string
  tempFile?: string
}> => {
  const tempFile = await writeFiles(
    [
      { file, fileName: 'main.curv' },
      {
        file: JSON.stringify({
          parameterSets: { default: parameters },
          fileFormatVersion: '1',
        }),
        fileName: 'params.json',
      },
    ],
    'a' + nanoid() // 'a' ensure nothing funny happens if it start with a bad character like "-", maybe I should pick a safer id generator :shrug:
  )
  const fullPath = `/tmp/${tempFile}/output.gz`
  const imPath = `/tmp/${tempFile}/output.png`
  const customizerPath = `/tmp/${tempFile}/customizer.param`

  const command = [
    'xvfb-run --auto-servernum --server-args "-screen 0 1024x768x24" curv',
    `-o ${imPath}`,
    `-O xsize=${x}`,
    `-O ysize=${y}`,
    `-O bg=webRGB[26,26,29]`, // #1A1A1D
    `/tmp/${tempFile}/main.curv`,
  ].join(' ')
  console.log('command', command)

  try {
    const consoleMessage = await runCommand(command, 15000)
    await writeFiles(
      [
        {
          file: JSON.stringify({
            consoleMessage,
            type: 'png',
          }),
          fileName: 'metadata.json',
        },
      ],
      tempFile
    )
    await runCommand(
      `cat ${imPath} /var/task/cadhub-concat-split /tmp/${tempFile}/metadata.json | gzip > ${fullPath}`,
      15000
    )
    return { consoleMessage, fullPath, customizerPath, tempFile }
  } catch (dirtyError) {
    return { error: dirtyError }
  }
}

export const stlExport = async ({ file, settings: { parameters } } = {}) => {
  const tempFile = await writeFiles(
    [
      { file, fileName: 'main.curv' },
      {
        file: JSON.stringify({
          parameterSets: { default: parameters },
          fileFormatVersion: '1',
        }),
        fileName: 'params.json',
      },
    ],
    'a' + nanoid() // 'a' ensure nothing funny happens if it start with a bad character like "-", maybe I should pick a safer id generator :shrug:
  )
  const fullPath = `/tmp/${tempFile}/output.gz`
  const stlPath = `/tmp/${tempFile}/output.stl`
  const command = [
    '(cd /tmp && curv',
    '-o', stlPath,
    '-O jit',
    '-O vcount=350000',
    `/tmp/${tempFile}/main.curv`,
    ')',
  ].join(' ')

  try {
    // lambda will time out before this, we might need to look at background jobs if we do git integration stl generation
    const consoleMessage = await runCommand(command, 60000)
    await writeFiles(
      [
        {
          file: JSON.stringify({
            consoleMessage,
            type: 'stl',
          }),
          fileName: 'metadata.json',
        },
      ],
      tempFile
    )
    await runCommand(
      `cat ${stlPath} /var/task/cadhub-concat-split /tmp/${tempFile}/metadata.json | gzip > ${fullPath} && rm ${stlPath}`,
      15000
    )
    return { consoleMessage, fullPath, tempFile }
  } catch (error) {
    return { error, fullPath }
  }
}
