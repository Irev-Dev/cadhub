import { CadhubParams } from 'src/components/Customizer/customizerConverter'

interface OpenScadParamsBase {
  caption: string
  name: string
  group: string
  initial: number | string | boolean | number[]
  type: 'string' | 'number' | 'boolean'
}

interface OpenScadNumberParam extends OpenScadParamsBase {
  type: 'number'
  initial: number | number[]
  max?: number
  min?: number
  step?: number
  options?: { name: string; value: number }[]
}
interface OpenScadStringParam extends OpenScadParamsBase {
  type: 'string'
  initial: string
  maxLength?: number
  options?: { name: string; value: string }[]
}
interface OpenScadBooleanParam extends OpenScadParamsBase {
  type: 'boolean'
  initial: boolean
}

export type OpenScadParams =
  | OpenScadNumberParam
  | OpenScadStringParam
  | OpenScadBooleanParam

export function openScadToCadhubParams(
  input: OpenScadParams[]
): CadhubParams[] {
  return input
    .map((param): CadhubParams => {
      const common: { caption: string; name: string } = {
        caption: param.caption,
        name: param.name,
      }
      switch (param.type) {
        case 'boolean':
          return {
            type: 'boolean',
            input: 'default-boolean',
            ...common,
            initial: param.initial,
          }
        case 'string':
          if (!Array.isArray(param?.options)) {
            return {
              type: 'string',
              input: 'default-string',
              ...common,
              initial: param.initial,
              maxLength: param.maxLength,
            }
          } else {
            return {
              type: 'string',
              input: 'choice-string',
              ...common,
              initial: param.initial,
              options: param.options,
            }
          }
        case 'number':
          if (
            !Array.isArray(param?.options) &&
            !Array.isArray(param?.initial)
          ) {
            return {
              type: 'number',
              input: 'default-number',
              ...common,
              initial: param.initial,
              min: param.min,
              max: param.max,
              step: param.step,
            }
          } else if (
            Array.isArray(param?.options) &&
            !Array.isArray(param?.initial)
          ) {
            return {
              type: 'number',
              input: 'choice-number',
              ...common,
              initial: param.initial,
              options: param.options,
            }
          } // TODO else vector
          break
        default:
          return
      }
    })
    .filter((a) => a)
}
