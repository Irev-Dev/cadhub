import { render } from '@redwoodjs/testing'

import ContactPage from './ContactPage'

describe('ContactPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ContactPage />)
    }).not.toThrow()
  })
})
