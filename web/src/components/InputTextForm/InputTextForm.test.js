import { render } from '@redwoodjs/testing'

import InputTextForm from './InputTextForm'

describe('InputTextForm', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<InputTextForm />)
    }).not.toThrow()
  })
})
