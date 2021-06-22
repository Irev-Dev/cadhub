---
slug: codecad-artifacts
title: Artifacts - STEP, png, BOM . . .
author: Kurt Hutten
author_title: CadHub Core Team
author_url: https://github.com/Irev-Dev
author_image_url: https://avatars.githubusercontent.com/u/29681384?v=4
tags: []
---

CI/CD pipelines usually have at most two types of artifacts. Primarily it will be the program, (an executable, web-app static files etc), and also often test reports. If the process is a bit more exotic it might have a couple other outputs. CodeCAD however, has a multitude of different types of artifacts that can be produced.

- The 3d files is obviously the primary output.
- Test reports would be the same too but with some [subtleties](/blog/testing-code-cad).
- Images/renders reproduced each merge would allow reports or webpages to stay up today with the latest model
- Bill of materials (BOM)
- GCODE or similar artifacts used for manufacture

<!--truncate-->

The good news is much of this could be setup today with a pipeline. Similar to [3d diffs](blog/3d-diffs) they are why we're excited to build a github integration with CadHub so that we can make producing these artifacts easy. One simple example beyond 3d-files is the renders. Putting nice renders of your project in your readme that automatically stay up-to-date brings a level of professionalism. Two good examples of projects that already do this are:
- The [open flexure microscope](https://gitlab.com/openflexure/openflexure-microscope)
- Scott Bezek's [Splitflap project](https://github.com/scottbez1/splitflap)

