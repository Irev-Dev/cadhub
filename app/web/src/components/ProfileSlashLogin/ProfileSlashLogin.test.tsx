import { render } from '@redwoodjs/testing'

import ProfileSlashLogin from './ProfileSlashLogin'

describe('ProfileSlashLogin', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ProfileSlashLogin />)
    }).not.toThrow()
  })
})
