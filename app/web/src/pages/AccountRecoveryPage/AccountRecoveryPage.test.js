import { render } from '@redwoodjs/testing'

import AccountRecoveryPage from './AccountRecoveryPage'

describe('AccountRecoveryPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AccountRecoveryPage />)
    }).not.toThrow()
  })
})
