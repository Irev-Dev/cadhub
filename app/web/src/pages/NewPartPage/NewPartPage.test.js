import { render } from '@redwoodjs/testing'

import NewPartPage from './NewPartPage'

describe('NewPartPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<NewPartPage />)
    }).not.toThrow()
  })
})
