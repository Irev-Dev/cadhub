import { render } from '@redwoodjs/testing'

import ConfirmDialog from './ConfirmDialog'

describe('ConfirmDialog', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ConfirmDialog />)
    }).not.toThrow()
  })
})
