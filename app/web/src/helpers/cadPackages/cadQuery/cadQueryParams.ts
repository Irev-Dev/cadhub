import { CadhubParams } from 'src/components/Customizer/customizerConverter'

interface CadQueryParamsBase {
  name: string
  initial: number | string
  type?: 'number'
}

interface CadQueryNumberParam extends CadQueryParamsBase {
  type: 'number'
  initial: number
}

interface CadQueryStringParam extends CadQueryParamsBase {
  initial: string
}

export type CadQueryStringParams =
  | CadQueryNumberParam
  | CadQueryStringParam


export function CadQueryToCadhubParams(
  input: CadQueryStringParams[]
): CadhubParams[] {
  return input
    .map((param): CadhubParams => {
      const common: { caption: string; name: string } = {
        caption: '',
        name: param.name,
      }
      if(param.type === 'number') {
        return {
          type: 'number',
          input: 'default-number',
          ...common,
          initial: Number(param.initial),
        }
      }
      return {
        type: 'string',
        input: 'default-string',
        ...common,
        initial: String(param.initial),
      }
    })
    .filter((a) => a)
}

