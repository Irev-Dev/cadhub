import { render } from '@redwoodjs/testing'

import IdeCascadeStudio from './IdeCascadeStudio'

describe('IdeCascadeStudio', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<IdeCascadeStudio />)
    }).not.toThrow()
  })
})
