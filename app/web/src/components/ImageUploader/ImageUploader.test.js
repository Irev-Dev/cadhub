import { render } from '@redwoodjs/testing'

import ImageUploader from './ImageUploader'

describe('ImageUploader', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ImageUploader />)
    }).not.toThrow()
  })
})
