import { DefaultKernelExport } from './common'
import type { CadPackage } from 'src/helpers/hooks/useIdeState'

import openscad from './openScad/openScadController'
import cadquery from './cadQueryController'
import jscad from './jsCad/jsCadController'

export const cadPackages: { [key in CadPackage]: DefaultKernelExport } = {
  openscad,
  cadquery,
  jscad,
}
