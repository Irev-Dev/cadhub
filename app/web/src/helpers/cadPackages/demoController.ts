// not an actual and there fore not imported into index.ts in this folder,
// this is boiler plate code for adding new integrations.

import { RenderArgs, DefaultKernelExport } from './common'

export const render: DefaultKernelExport['render'] = async ({
  code, // eslint-disable-line @typescript-eslint/no-unused-vars
  settings, // eslint-disable-line @typescript-eslint/no-unused-vars
}: RenderArgs) => {
  // do your magic
  return {
    status: 'healthy',
    message: {
      type: 'message',
      message: 'demo',
      time: new Date(),
    },
    objectData: {
      data: 'any',
      type: 'geometry',
    },
  }
}

const demoController: DefaultKernelExport = {
  render,
}

export default demoController
