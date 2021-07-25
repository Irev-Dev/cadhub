import { RenderArgs, DefaultKernelExport, createUnhealthyResponse } from './common'

export const render: DefaultKernelExport['render'] = async ({
  code,
  settings,
}: RenderArgs) => {
  // do your magic
  return createUnhealthyResponse( new Date(), 'JSCAD controller not implemented yet')
}

const jsCadController: DefaultKernelExport = {
  render,
}

export default jsCadController
