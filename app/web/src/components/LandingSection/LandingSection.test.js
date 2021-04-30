import { render } from '@redwoodjs/testing'

import LandingSection from './LandingSection'

describe('LandingSection', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<LandingSection />)
    }).not.toThrow()
  })
})
