const jscad = require('@jscad/modeling')
// https://openjscad.xyz/docs/module-modeling_primitives.html
const { cuboid, cylinder } = jscad.primitives

const { rotate, translate } = jscad.transforms
const { degToRad } = jscad.utils // because jscad uses radians for rotations
// https://openjscad.xyz/docs/module-modeling_booleans.html
const { subtract } = jscad.booleans

function main({
  //@jscad-params
  // Box example
  width = 40, // Width
  length = 20, // Length
  height = 10, // Height
  hole = 3, // Hole for cables diameter (0=no hole)
  wall = 1, // wall {min:0.5, step:0.5}
  flip = 0, // print orientation {type: 'choice', values: [0, 90, 180]}
}) {
  let wallOffset = wall * 2
  let model = subtract(
    cuboid({ size: [width, length, height] }),
    translate(
      [0, 0, wall],
      cuboid({ size: [width - wallOffset, length - wallOffset, height + wall] })
    )
  )
  if (hole) {
    model = subtract(
      model,
      translate(
        [width / 2 - wall / 2],
        rotate(
          [0, degToRad(90), 0],
          cylinder({ radius: hole / 2, height: wall })
        )
      )
    )
  }
  return rotate([degToRad(flip), 0, degToRad(90)], model)
}

module.exports = { main } // eslint-disable-line
