import { CadhubParams } from 'src/components/Customizer/customizerConverter'

interface CadQueryParamsBase {
  name: string
  initial: number | string | boolean
  type?: 'number' | 'string' | 'boolean'
}

interface CadQueryNumberParam extends CadQueryParamsBase {
  type: 'number'
  initial: number
}

interface CadQueryStringParam extends CadQueryParamsBase {
  type: 'string'
  initial: string
}

interface CadQueryBooleanParam extends CadQueryParamsBase {
  type: 'boolean'
  initial: boolean
}

export type CadQueryStringParams =
  | CadQueryNumberParam
  | CadQueryStringParam
  | CadQueryBooleanParam

export function CadQueryToCadhubParams(
  input: CadQueryStringParams[]
): CadhubParams[] {
  return input
    .map((param): CadhubParams => {
      const common: { caption: string; name: string } = {
        caption: '',
        name: param.name,
      }
      switch (param.type) {
        case 'number':
          return {
            type: 'number',
            input: 'default-number',
            ...common,
            initial: param.initial || 0,
          }
        case 'string':
          return {
            type: 'string',
            input: 'default-string',
            ...common,
            initial: param.initial || '',
          }
        case 'boolean':
          return {
            type: 'boolean',
            input: 'default-boolean',
            ...common,
            initial: param.initial || false,
          }
      }
    })
    .filter((a) => a)
}
