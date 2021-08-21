import { CadhubNumberChoiceParam, CadhubNumberOption, CadhubParams, CadhubStringChoiceParam, CadhubStringOption } from 'src/components/Customizer/customizerConverter'

type JscadTypeNames =
  | 'group'
  | 'text'
  | 'int'
  | 'number'
  | 'slider'
  | 'email'
  | 'password'
  | 'date'
  | 'url'
  | 'checkbox'
  | 'color'
  | 'choice'
  | 'radio'

interface JscadParamBase {
  type: JscadTypeNames
  caption: string
  name: string
}
interface JscadGroupParam extends JscadParamBase {
  type: 'group'
  initial?: 'open' | 'closed'
}
interface JscadTextParam extends JscadParamBase {
  type: 'text'
  initial: string
  placeholder: string
  size: number
  maxLength: number
}
interface JscadIntNumberSliderParam extends JscadParamBase {
  type: 'int' | 'number' | 'slider'
  initial: number
  min?: number
  max?: number
  step?: number
}
interface JscadDateParam extends JscadParamBase {
  type: 'date'
  initial: string
  min: string
  max: string
  placeholder: string
}
interface JscadEmailPasswordColorParam extends JscadParamBase {
  type: 'email' | 'password' | 'color'
  initial: string
}
interface JscadUrlParam extends JscadParamBase {
  type: 'url'
  initial: string
  maxLength: number
  size: number
  placeholder: string
}
interface JscadCheckboxParam extends JscadParamBase {
  type: 'checkbox'
  checked: boolean
  initial: boolean
}
interface JscadChoiceRadioParam extends JscadParamBase {
  type: 'choice' | 'radio'
  initial: number | string
  values: (string | number)[]
  captions?: string[]
}

type JsCadParams =
  | JscadGroupParam
  | JscadTextParam
  | JscadIntNumberSliderParam
  | JscadDateParam
  | JscadEmailPasswordColorParam
  | JscadUrlParam
  | JscadCheckboxParam
  | JscadChoiceRadioParam

export function jsCadToCadhubParams(input: JsCadParams[]): CadhubParams[] {
  return input
    .map((param): CadhubParams => {
      switch (param.type) {
        case 'slider':
        case 'number':
        case 'int':
          return {
            type: 'number',
            caption: param.caption,
            name: param.name,
            initial: param.initial,
            min: param.min,
            max: param.max,
            step: param.step,
            decimal: param.step % 1 === 0 && param.initial % 1 === 0 ? 0 : 2,
          }
        case 'text':
        case 'url':
        case 'email':
        case 'password':
        case 'color':
        case 'date':
          return {
            type: 'string',
            caption: param.caption,
            name: param.name,
            initial: param.initial,
            placeholder:
              param.type === 'text' ||
              param.type === 'date' ||
              param.type === 'url'
                ? param.placeholder
                : '',
            maxLength:
              param.type === 'text' || param.type === 'url'
                ? param.maxLength
                : undefined,
          }
        case 'checkbox':
          return {
            type: 'boolean',
            caption: param.caption,
            name: param.name,
            initial: !!param.initial,
          }
          case 'choice':
            if(typeof param.values[0] === 'number'){
              let options:Array<CadhubNumberOption> = []
              let captions = param.captions || param.values
              param.values.forEach((value,i)=>{
                options[i] = {name:String(captions[i]), value:Number(value)}
              })
              return  {
                type:  'number',
                input: 'choice',
                caption: param.caption,
                name: param.name,
                initial: Number(param.initial),
                options
              }
            }else{
              let options:Array<CadhubStringOption> = []
              let captions = param.captions || param.values
              param.values.forEach((value,i)=>{
                options[i] = {name:String(captions[i]), value:String(value)}
              })
              return  {
                type:  'string',
                input: 'choice',
                caption: param.caption,
                name: param.name,
                initial: String(param.initial),
                options
              }              
            }


      }
    })
    .filter((a) => a)
}
