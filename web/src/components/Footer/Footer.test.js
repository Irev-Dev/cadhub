import { render } from '@redwoodjs/testing'

import Footer from './Footer'

describe('Footer', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Footer />)
    }).not.toThrow()
  })
})
