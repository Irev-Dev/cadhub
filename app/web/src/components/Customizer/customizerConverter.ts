// CadHub

type CadhubTypeNames = 'number' | 'string' | 'boolean'
type CadhubInputNames =
  | 'default-number'
  | 'default-string'
  | 'default-boolean'
  | 'choice-string'
  | 'choice-number'

export interface CadhubStringOption {
  name: string
  value: string
}

export interface CadhubNumberOption {
  name: string
  value: number
}

interface CadhubParamBase {
  type: CadhubTypeNames
  caption: string
  name: string
  input: CadhubInputNames
}

export interface CadhubStringParam extends CadhubParamBase {
  type: 'string'
  input: 'default-string'
  initial: string
  placeholder?: string
  maxLength?: number
}
export interface CadhubBooleanParam extends CadhubParamBase {
  type: 'boolean'
  input: 'default-boolean'
  initial?: boolean
}
export interface CadhubNumberParam extends CadhubParamBase {
  type: 'number'
  input: 'default-number'
  initial: number
  min?: number
  max?: number
  step?: number
  decimal?: number
}

export interface CadhubStringChoiceParam extends CadhubParamBase {
  type: 'string'
  input: 'choice-string'
  initial: string
  options: Array<CadhubStringOption>
}
export interface CadhubNumberChoiceParam extends CadhubParamBase {
  type: 'number'
  input: 'choice-number'
  initial: number
  options: Array<CadhubNumberOption>
}

export type CadhubParams =
  | CadhubStringParam
  | CadhubBooleanParam
  | CadhubNumberParam
  | CadhubStringChoiceParam
  | CadhubNumberChoiceParam
