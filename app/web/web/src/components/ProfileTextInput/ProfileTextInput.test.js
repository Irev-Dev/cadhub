import { render } from '@redwoodjs/testing'

import ProfileTextInput from './ProfileTextInput'

describe('ProfileTextInput', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ProfileTextInput />)
    }).not.toThrow()
  })
})
