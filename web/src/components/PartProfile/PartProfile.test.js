import { render } from '@redwoodjs/testing'

import PartProfile from './PartProfile'

describe('PartProfile', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<PartProfile />)
    }).not.toThrow()
  })
})
