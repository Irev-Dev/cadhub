import { render } from '@redwoodjs/testing'

import InputText from './InputText'

describe('InputText', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<InputText />)
    }).not.toThrow()
  })
})
