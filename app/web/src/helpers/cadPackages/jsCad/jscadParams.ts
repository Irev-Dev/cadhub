import type { RawCustomizerParams } from '../common'

const GROUP_SELECTOR = 'DIV[type="group"]'
const INPUT_SELECTOR = 'INPUT, SELECT'

function forEachInput(
  target: HTMLElement,
  callback: (e: HTMLInputElement) => void
) {
  target.querySelectorAll(INPUT_SELECTOR).forEach(callback)
}

function forEachGroup(target: HTMLElement, callback: (e: HTMLElement) => void) {
  target.querySelectorAll(GROUP_SELECTOR).forEach(callback)
}

const numeric = { number: 1, float: 1, int: 1, range: 1, slider: 1 }

function applyRange(inp) {
  const label = inp.previousElementSibling
  if (label && label.tagName == 'LABEL') {
    const info = label.querySelector('I')
    if (info) info.innerHTML = inp.value
  }
}

export function genParams(
  defs,
  target,
  storedParams = {},
  callback: (values: RawCustomizerParams, source: any) => void = undefined,
  buttons = ['reset', 'save', 'load', 'edit', 'link']
) {
  const funcs = {
    group: () => '',
    choice: inputChoice,
    radio: inputRadio,
    float: inputNumber,
    range: inputNumber,
    slider: inputNumber,
    int: inputNumber,
    text: inputNumber,
    url: inputNumber,
    email: inputNumber,
    date: inputNumber,
    password: inputNumber,
    color: inputNumber,
    // TODO radio similar options as choice
    checkbox: function ({ name, value }) {
      const checkedStr = value === 'checked' || value === true ? 'checked' : ''
      return `<input type="checkbox" name="${name}" ${checkedStr}/>`
    },
    number: inputNumber,
  }

  function inputRadio({ name, type, captions, value, values }) {
    if (!captions) captions = values

    let ret = '<div type="radio">'

    for (let i = 0; i < values.length; i++) {
      const checked =
        value == values[i] || value == captions[i] ? 'checked' : ''
      ret += `<label><input type="radio" _type="${type}" name="${name}" numeric="${
        typeof values[0] == 'number' ? '1' : '0'
      }" value="${values[i]}" ${checked}/>${captions[i]}</label>`
    }
    return ret + '</div>'
  }

  function inputChoice({ name, type, captions, value, values }) {
    if (!captions) captions = values

    let ret = `<select _type="${type}" name="${name}" numeric="${
      typeof values[0] == 'number' ? '1' : '0'
    }">`

    for (let i = 0; i < values.length; i++) {
      const checked =
        value == values[i] || value == captions[i] ? 'selected' : ''
      ret += `<option value="${values[i]}" ${checked}>${captions[i]}</option>`
    }
    return ret + '</select>'
  }

  function inputNumber(def) {
    let { name, type, value, min, max, step, placeholder, live } = def
    if (value === null || value === undefined) value = numeric[type] ? 0 : ''
    let inputType = type
    if (type == 'int' || type == 'float') inputType = 'number'
    if (type == 'range' || type == 'slider') inputType = 'range'
    let str = `<input _type="${type}" type="${inputType}" name="${name}"`
    if (step !== undefined) str += ` step="${step || ''}"`
    if (min !== undefined) str += ` min="${min || ''}"`
    if (max !== undefined) str += ` max="${max || ''}"`
    if (value !== undefined) str += ` value="${value}"`
    str += ` live="${live ? 1 : 0}"`
    if (placeholder !== undefined) str += ` placeholder="${placeholder}"`
    return str + '/>'
  }

  let html = ''
  let closed = false
  const missing = {}

  defs.forEach((def) => {
    const { type, caption, name } = def

    if (storedParams[name] !== undefined) {
      def.value = storedParams[name]
    } else {
      def.value = def.initial || def['default'] || def.checked
    }

    if (type == 'group') {
      closed = def.value == 'closed'
    }
    def.closed = closed

    html += `<div class="form-line" type="${def.type}" closed="${
      closed ? 1 : 0
    }" `
    if (type == 'group') html += ` name="${name}"`
    html += `">`

    html += `<label`
    if (type == 'group') html += ` name="${name}"`
    html += `>`
    if (type == 'checkbox') html += funcs[type](def)
    html += `${caption}<i>${def.value}</i></label>`

    if (funcs[type] && type != 'checkbox') html += funcs[type](def)

    if (!funcs[type]) missing[type] = 1

    html += '</div>\n'
  })

  const missingKeys = Object.keys(missing)
  if (missingKeys.length) console.log('missing param impl', missingKeys)

  function _callback(source = 'change') {
    if (callback && source !== 'group') callback(getParams(target), source)
  }

  html += '<div class="jscad-param-buttons"><div>'
  buttons.forEach((button) => {
    const { id, name } =
      typeof button === 'string' ? { id: button, name: button } : button
    html += `<button action="${id}"><b>${name}</b></button>`
  })
  html += '</div></div>'

  target.innerHTML = html

  forEachInput(target, (inp) => {
    const type = inp.type
    inp.addEventListener('input', function (evt) {
      applyRange(inp)
      if (inp.getAttribute('live') === '1') _callback('live')
    })
    if (inp.getAttribute('live') !== '1')
      inp.addEventListener('change', () => _callback('change'))
  })

  function groupClick(evt) {
    let groupDiv = evt.target
    if (groupDiv.tagName === 'LABEL') groupDiv = groupDiv.parentNode
    const closed = groupDiv.getAttribute('closed') == '1' ? '0' : '1'
    do {
      groupDiv.setAttribute('closed', closed)
      groupDiv = groupDiv.nextElementSibling
    } while (groupDiv && groupDiv.getAttribute('type') != 'group')
    _callback('group')
  }

  forEachGroup(target, (div) => {
    div.onclick = groupClick
  })
}

function getParams(target: HTMLElement): RawCustomizerParams {
  const params = {}
  if (!target) return params

  forEachGroup(target, (elem) => {
    const name = elem.getAttribute('name')
    params[name] = elem.getAttribute('closed') == '1' ? 'closed' : ''
  })

  forEachInput(target, (elem) => {
    const name = elem.name
    let value: RawCustomizerParams[string] = elem.value
    if (elem.tagName == 'INPUT') {
      if (elem.type == 'checkbox') value = elem?.checked
      if (elem.type == 'range' || elem.type == 'color') applyRange(elem)
    }

    if (
      numeric[elem.getAttribute('type')] ||
      elem.getAttribute('numeric') == '1'
    ) {
      value = parseFloat(String(value || 0))
    } else if (
      value &&
      typeof value === 'string' &&
      /^(\d+|\d+\.\d+)$/.test(value.trim())
    ) {
      value = parseFloat(String(value || 0))
    }
    if (elem.type == 'radio' && !elem.checked) return // skip if not checked radio button

    params[name] = value
  })
  return params
}
