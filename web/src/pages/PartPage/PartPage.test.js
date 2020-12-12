import { render } from '@redwoodjs/testing'

import PartPage from './PartPage'

describe('PartPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<PartPage />)
    }).not.toThrow()
  })
})
