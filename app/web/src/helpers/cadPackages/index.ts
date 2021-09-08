import { DefaultKernelExport } from './common'
import type { CadPackageType } from 'src/components/CadPackage/CadPackage'

import openscad from './openScad/openScadController'
import cadquery from './cadQueryController'
import jscad from './jsCad/jsCadController'

export const cadPackages: { [key in CadPackageType]: DefaultKernelExport } = {
  openscad,
  cadquery,
  jscad,
}
