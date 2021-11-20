import { writeFiles, runCommand } from '../common/utils'
import { nanoid } from 'nanoid'
const { readFile } = require('fs/promises')
const fs = require('fs');
const { spawn } = require('child_process');

function* getXDisplayNumber() {
    const startValue = 99;
    let i = startValue;
    while(true) {
        i -= 1;

        // Never hit zero since 0 is usually used by desktop users.
        if (i <= 0) i = startValue;
        yield ':' + i;
    }
}


export const runCurv = async ({
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
  const { x: rx, y: ry, z: rz } = rotation
  const { x: px, y: py, z: pz } = position
  const cameraArg = `--camera=${px},${py},${pz},${rx},${ry},${rz},${dist}`
  const fullPath = `/tmp/${tempFile}/output.gz`
  const imPath = `/tmp/${tempFile}/output.png`
  const customizerPath = `/tmp/${tempFile}/customizer.param`
  const summaryPath = `/tmp/${tempFile}/summary.json` // contains camera info

  const code = file;
  const DISPLAY = getXDisplayNumber().next().value;

  const xvfbProcess = spawn(
     'Xvfb',
     [DISPLAY, '-ac', '-nocursor', '-screen', '0', '480x500x24'],
  );

  const curvProcess = spawn(
     'curv',
     ['-' ],
    { env: Object.assign({}, process.env, { DISPLAY, PATH: '/usr/local/bin' }) }
  );

  curvProcess.stdin.write(code);
  curvProcess.stdin.end();

  let statusSet = false;
  let contentTypeSet = false;

  curvProcess.stderr.on('data', (buf) => {
    const data = buf.toString('utf8');
    if (data.indexOf('shape') >= 0) {
      setTimeout(() => {
        const screenshotProcess = spawn('maim', ['--hidecursor', imPath], { env: { DISPLAY } });
        screenshotProcess.on('close', () => {
          curvProcess.kill();
          xvfbProcess.kill();
        });
      }, 1000);
    }

    if (data.indexOf('ERROR') < 0) { return; }
    curvProcess.kill();
    xvfbProcess.kill();
  });


  try {
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
  const customizerPath = `/tmp/${tempFile}/customizer.param`
  const command = [
    'curv',
    '-o', stlPath,
    '-O jit',
    '-O vsize=0.4',
    `/tmp/${tempFile}/main.curv`,
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
