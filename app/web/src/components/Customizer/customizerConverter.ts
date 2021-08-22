// CadHub

type CadhubTypeNames = 'number' | 'string' | 'boolean'
type CadhubInputNames = 'default-number' | 'default-string' | 'default-boolean' | 'choice-string' | 'choice-number'

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

// OpenSCAD
const openscadValues = `
// slider widget for number with max. value
sliderWithMax =34; // [50]

// slider widget for number in range
sliderWithRange =34; // [10:100]

//step slider for number
stepSlider=2; //[0:5:100]

// slider widget for number in range
sliderCentered =0; // [-10:0.1:10]

// spinbox with step size 1
Spinbox= 5;

// Text box for string
String="hello";

// Text box for string with length 8
String2="length"; //8

//description
Variable = true;
`

const openscadConverted: CadhubParams[] = [
  {
    type: 'number',
    name: 'sliderWithMax',
    caption: 'slider widget for number with max. value',
    initial: 34,
    step: 1,
    max: 50,
  },
  {
    type: 'number',
    name: 'sliderWithRange',
    caption: 'slider widget for number in range',
    initial: 34,
    step: 1,
    min: 10,
    max: 100,
  },
  {
    type: 'number',
    name: 'stepSlider',
    caption: 'step slider for number',
    initial: 2,
    step: 5,
    min: 0,
    max: 100,
  },
  {
    type: 'number',
    name: 'sliderCentered',
    caption: 'slider widget for number in range',
    initial: 0,
    step: 0.1,
    min: -10,
    max: 10,
  },
  {
    type: 'number',
    name: 'Spinbox',
    caption: 'spinbox with step size 1',
    initial: 5,
    step: 1,
  },

  {
    type: 'string',
    name: 'String',
    caption: 'Text box for string',
    initial: 'hello',
  },
  {
    type: 'string',
    name: 'String2',
    caption: 'Text box for string with length 8',
    initial: 'length',
    maxLength: 8,
  },

  { type: 'boolean', name: 'Variable', caption: 'description', initial: true },
]
