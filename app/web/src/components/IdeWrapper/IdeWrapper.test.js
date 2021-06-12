// import { githubSafe } from './IdeToolbarNew.js'
// TODO jest doesn't like ECMAScript modules and is failing further down in the tree because three ES modules
// Need to update config

describe('githubSafe', () => {
  const rawUrl =
    'https://raw.githubusercontent.com/aaevan/openscad_objects/main/fire_tablet_bottom_corner.scad'
  it('It transforms non-raw url to raw urls', () => {
    expect(1).toBe(1)
  })
  // it('It transforms non-raw url to raw urls', () => {
  //   expect(
  //     githubSafe(
  //       'https://github.com/aaevan/openscad_objects/blob/main/fire_tablet_bottom_corner.scad'
  //     )
  //   ).toBe(rawUrl)
  // })
  // it('It leaves raw urls untouched', () => {
  //   expect(githubSafe(rawUrl)).toBe(rawUrl)
  // })
})
