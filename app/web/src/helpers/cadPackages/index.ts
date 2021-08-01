import { DefaultKernelExport } from './common'
import type { CadPackage } from 'src/helpers/hooks/useIdeState'

import openscad from './openScadController'
import cadquery from './cadQueryController'
import jscad from './jsCadController'

export const cadPackages: { [key in CadPackage]: DefaultKernelExport } = {
  openscad,
  cadquery,
  jscad,
}
