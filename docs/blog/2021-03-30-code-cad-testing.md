---
slug: testing-code-cad
title: What should we test?
author: Kurt Hutten
author_title: CadHub Core Team
author_url: https://github.com/Irev-Dev
author_image_url: https://avatars.githubusercontent.com/u/29681384?v=4
tags: []
---

CodeCad is software, and software should have tests right? is it that simple? Yes but also no.

Yes because unit tests will be fundamentally the same for testing any small part of the CAD code. But No because CodeCAD is a unique application of software, it brings with it it's own unique tests. Though tests might be too vague of a term. Let's keep "tests" for unit tests, but introduce "checks" and "analyses" to encompass other processes that we want to run as part of verifying changes to our CAD software.

<!--truncate-->

## Checks

Are sanity checks to makes sure your part can actually be made, these checks might be written in a similar fashion to unit tests but because they encompass checking things that are not strickly part of the model, but more to do with how it's manufactured, they could be instead supplied by equipment manufacture instead of written in-house. Easiest to show with some thought experiments:

###  Check if the part can be machined on XYZ milling machine?

A bad commit removed a 4mm fillet so now there is a sharp internal corner. From the position the part is intended to be machined, this corner is impossible. In order to preform this check lots of context about the machine is needed, perhaps the code for the check is provided by the vertical-mill manufacturer where a config file with the intended milling bits is provided by you, or perhaps a third party manufacture-on-demand company provides an endpoint for models to be sent to so they can do their own checks.

Another example might be, "is our 3d printer able to print an overhang that steep or bridge a gap that large".

The idea of tooling manufacturers providing code to run verification checks implies that CodeCAD has gone mainstream and so manufactures can see the benefit of providing this to their customers. I don't know how likely this is, but I do know I'm allowed to dream.

### Various sanity checks.

- Check the part is no longer than six meters, because that's how long the rems of material are.
- Check the part weighs no more than 5 kilograms, because that's the weight budget for our team in a larger weight constrained project.

These border on unit tests. They're bespoke therefore likely to be written in house. Though because they are asking questions about the overall project and not internal logic, that I think they fit better as checks rather than unit-tests.

## Analyses

This is for running all the typical simulations that are done on CAD parts, FEM, fluid, thermal . . .
Having these re-run on pull-requests or changes to the main branch is useful enough. But it's worth considering their relation to our code as well. Ideally we're able to setup the conditions of the simulations in code as well. In the process of modeling our part we have [tagged specific surfaces](/blog/right-level-of-abstraction#where-has-codecad-gone-wrong----its-csg) of our model, those can intern be used to define the specifics of an FEM simulation for example, ie where forces are applied and so on.
