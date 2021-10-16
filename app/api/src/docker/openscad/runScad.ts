import { writeFiles, runCommand } from '../common/utils'
import { nanoid } from 'nanoid'
const { readFile } = require('fs/promises')

const OPENSCAD_COMMON = `xvfb-run --auto-servernum --server-args "-screen 0 1024x768x24" openscad-nightly`

/** Removes our generated/hash filename with just "main.scad", so that it's a nice message in the IDE */
const cleanOpenScadError = (error) =>
  error.replace(/["|']\/tmp\/.+\/main.scad["|']/g, "'main.scad'")

export const runScad = async ({
  file,
  settings: {
    viewAll = false,
    size: { x = 500, y = 500 } = {},
    parameters,
    camera: {
      position = { x: 40, y: 40, z: 40 },
      rotation = { x: 55, y: 0, z: 25 },
      dist = 200,
    } = {},
  } = {}, // TODO add view settings
} = {}): Promise<{
  error?: string
  consoleMessage?: string
  fullPath?: string
  customizerPath?: string
}> => {
  const tempFile = await writeFiles(
    [
      { file, fileName: 'main.scad' },
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
  const { x: rx, y: ry, z: rz } = rotation
  const { x: px, y: py, z: pz } = position
  const cameraArg = `--camera=${px},${py},${pz},${rx},${ry},${rz},${dist}`
  const fullPath = `/tmp/${tempFile}/output.gz`
  const imPath = `/tmp/${tempFile}/output.png`
  const customizerPath = `/tmp/${tempFile}/customizer.param`
  const summaryPath = `/tmp/${tempFile}/summary.json` // contains camera info
  const command = [
    OPENSCAD_COMMON,
    `-o ${customizerPath}`,
    `-o ${imPath}`,
    `--summary camera --summary-file ${summaryPath}`,
    viewAll ? '--viewall' : '',
    `-p /tmp/${tempFile}/params.json -P default`,
    cameraArg,
    `--imgsize=${x},${y}`,
    `--colorscheme CadHub`,
    `/tmp/${tempFile}/main.scad`,
  ].join(' ')
  console.log('command', command)

  try {
    const consoleMessage = await runCommand(command, 15000)
    const files: string[] = await Promise.all(
      [customizerPath, summaryPath].map((path) =>
        readFile(path, { encoding: 'ascii' })
      )
    )
    const [params, cameraInfo] = files.map((fileStr: string) =>
      JSON.parse(fileStr)
    )
    await writeFiles(
      [
        {
          file: JSON.stringify({
            cameraInfo: viewAll ? cameraInfo.camera : undefined,
            customizerParams: params.parameters,
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
    return { consoleMessage, fullPath, customizerPath }
  } catch (dirtyError) {
    return { error: cleanOpenScadError(dirtyError) }
  }
}

export const stlExport = async ({ file, settings: { parameters } } = {}) => {
  const tempFile = await writeFiles(
    [
      { file, fileName: 'main.scad' },
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
  const customizerPath = `/tmp/${tempFile}/customizer.param`
  const command = [
    OPENSCAD_COMMON,
    // `--export-format=binstl`,
    `-o ${customizerPath}`,
    `-o ${stlPath}`,
    `-p /tmp/${tempFile}/params.json -P default`,
    `/tmp/${tempFile}/main.scad`,
  ].join(' ')

  try {
    // lambda will time out before this, we might need to look at background jobs if we do git integration stl generation
    const consoleMessage = await runCommand(command, 60000)
    const params = JSON.parse(
      await readFile(customizerPath, { encoding: 'ascii' })
    ).parameters
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
      15000
    )
    return { consoleMessage, fullPath, customizerPath }
  } catch (error) {
    return { error, fullPath }
  }
}
