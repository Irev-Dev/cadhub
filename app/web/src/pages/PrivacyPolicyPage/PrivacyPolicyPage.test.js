import { render } from '@redwoodjs/testing'

import PrivacyPolicyPage from './PrivacyPolicyPage'

describe('PrivacyPolicyPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<PrivacyPolicyPage />)
    }).not.toThrow()
  })
})
