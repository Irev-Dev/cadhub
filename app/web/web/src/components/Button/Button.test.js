import { render } from '@redwoodjs/testing'

import Button from './Button'

describe('Button', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Button />)
    }).not.toThrow()
  })
})
