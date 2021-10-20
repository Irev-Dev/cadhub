---
slug: curated-code-cad
title: Curated Code CAD
author: Kurt Hutten
author_title: CadHub Core Team
author_url: https://github.com/Irev-Dev
author_image_url: https://avatars.githubusercontent.com/u/29681384?v=4
tags: []
---

# Curated Code Cad ⚙️ 👩‍🔧

<img src="https://raw.githubusercontent.com/Irev-Dev/repo-images/main/images/CURATED-CODE-CAD-BANNER2.jpg" />

## What is Code-CAD?
It's software that allows you to define 3D CAD models with code. It's a niche popular amongst software devs for obvious reasons — it gives you parametric models almost by default and it's easy to maintain and extend models within a team over time when paired with git. The coding nature of it allows teams to build their own abstraction for re-use and quick prototyping. The [Cadhub docs](https://learn.cadhub.xyz/) has a good breakdown of the potential of the Code-CAD paradigm. Code-CAD is not to be confused with 3d geometry libraries, Code-CAD instead has opinionated abstractions for quickly developing mechanical parts.

## Which one should you use?

I recommend reading through the entire list below to see if one chimes with you and your needs, beyond that I can make the following recommendation and points:
<!--truncate-->
- My main recommendation is to use one of the packages that uses a B-rep kernal (and for opensounce tools that means OpenCascade, a mature C++ CAD library). Packages that do so are CadQuery, CascadeStudio, DeclaraCAD and pythonOCC. My reasons for recommending these are as follows:
  - Most of Code-CAD tools are plagued with a CSG mindset (that is unions, subtractions and intersections of primitive shapes; cubes spheres etc). This is an inherently limited paradigm (one simple example of this is how internal fillets, which are important for reducing stress concentrations in parts, become very difficult). While CadQuery, CascadeStudio, DeclaraCAD and pythonOCC still offer CSG functionality, you're also able to move beyond.
  - OpenCascade uses a B-rep (boundary representation) kernel, In my opinion, this means you'll be learning a future-proof tool that won't limit the types of applications you can model for, which is likely the case for mesh kernels, which will cause trouble in for some applications like optics and injection moulding.

- OpenSCAD is tried and true, with lots of examples and tutorials floating around the internet. It also has a very intuitive syntax that folks without prior programming experience have been able to quickly pick up. However, some reasons you might want to look elsewhere are:
  - It can be hard to build powerful abstractions since they've rolled their own language. Consequences of this include that it doesn't have a package manager like many modern languages, and the presence of quirks with the language, such as function definitions that aren't ergonomic.
  - Performance can start to suffer with complex parts.
  - Its mesh-based kernel has limitations if you want to move beyond 3d-printed parts.
- Check out the [birdhouse example](https://github.com/Irev-Dev/curated-code-cad/tree/main/birdhouse), while anecdotal, seeing the same part made with different tools might help you decide which syntax you like the most.
- You might want to simply pick a tool based on your language of choice. Clojure, enaml, Go, Haskell, Lisp, Javascript and Python are all represented below.
- If you want to make 3D art, Curv is specifically trying to hit that niche.

No matter which one is your tool of choice, if you're here and you love Code-CAD and you'll want to checkout [Cadhub](https://cadhub.xyz/). Think of it as Codepen crossed with a thing repository, and it's our love letter to the Maker community. Currently there are integrations for OpenSCAD, CadQuery and JSCAD, and we're working on more. [Site](https://cadhub.xyz/), [repo](https://github.com/Irev-Dev/cadhub).

## Special mention

### [OpenSCAD](http://www.openscad.org/)
- [Repo](https://github.com/openscad/openscad)
- [Community](http://www.openscad.org/community.html)
- [Docs](http://www.openscad.org/documentation.html)
- License: GPL-2
- [Online editor](https://cadhub.xyz/dev-ide/openscad)

The rest of the packages are in alphabetical order, but OpenSCAD gets a special mention because it's the OG. Many of the projects below were inspired by OpenSCAD and is the most well-known choice. If you're new to code-cad this is the safest choice. The syntax is easy to pick up and there lots of guides around the internet.

### [OpenCascade](https://www.opencascade.com/)
- [Repo](https://github.com/tpaviot/oce)
- [Community](https://dev.opencascade.org/)
- [Docs](https://old.opencascade.com/doc/occt-6.9.1/refman/html/index.html)
- License: LGPL-2.1
- ~~Online editor~~

It's a c++ library that a number the projects below wrap. OpenCascade uses a Boundary representation (B-rep) kernel, which is a powerful way representing solid geometry, this is a point of difference for some many of the other projects that use a polygon mesh.

## Contributing

There are a couple of ways you can help:
- Know of a package that we missed? tell us with an issue or open up a PR.
- Contribute a birdhouse design in one of the tools that are missing.
- Do you think we missed an important point for one of the projects, suggest more details.

## Here they are:

### [AngelCAD](https://arnholm.github.io/angelcad-docs/)
- [Repo](https://github.com/arnholm/angelcad)
- [Community](https://forum.abmesh.com/index.php)
- [Docs](https://arnholm.github.io/angelcad-docs/)
- License: GPL-2 or GPL-3
- ~~Online editor~~

AngelCAD aim to do two things:
1) Offer an embedded, but general-purpose scripting language for Constructive Solid Geometry, via [AngelScript](https://www.angelcode.com/angelscript/). This allows for a natural programming style with true variables, user-defined functions and even classes. Programmers should feel at home. See [AngelCAD sample scripts](https://github.com/arnholm/angelcad-samples).

2) Offer a fast boolean engine, which is powered by [Carve](https://github.com/arnholm/carve) is used for this purpose. This means that AngelCAD is generally many times faster than other mesh-based systems.

AngelCAD is capable of running OpenSCAD script for interoperability and has features like text support and DXF import coming soon.

### [bitbybit](https://bitbybit.dev/home)
- [Repo](https://github.com/bitbybit-dev/bitbybit)
- [Community](https://discord.com/invite/GSe3VMe)
- [Docs](https://docs.bitbybit.dev/)
- License: MIT
- [Online editor](https://bitbybit.dev/app)

bitbybit is both a node editor and Code-CAD as they have exposed a [typescript](https://medium.com/@bitbybit/v0-3-0-release-typescript-in-monaco-editor-for-bit-by-bit-developers-46bcb1a3b91) interface that can be used in their app.

### [CadHub](https://cadhub.xyz/)
- [Repo](https://github.com/Irev-Dev/cadhub)
- [Community](https://discord.com/invite/SD7zFRNjGH)
- ~~Docs~~
- License: GPL-3
- [Online editor](https://cadhub.xyz/)

A community hub for sharing code-cad projects. Currently integrates with [CadQuery](https://cadquery.readthedocs.io/en/latest/intro.html) and [OpenScad](http://www.openscad.org/). Built and maintained by yours truly.

![CadHub IDE screenshot](/img/blog/curated-code-cad/CadHubSS.jpg)
### [CadQuery](https://cadquery.readthedocs.io/en/latest/intro.html)
- [Repo](https://github.com/CadQuery/cadquery)
- [Community](https://discord.gg/qz3uAdF)
- [Docs](https://cadquery.readthedocs.io/en/latest/intro.html)
- License: Apache, 2.0
- [Online editor](https://cadhub.xyz/dev-ide/cadquery)

CadQuery is a Python library that wraps and extends [OpenCascade](https://github.com/tpaviot/oce). It has a philosophy of capturing design intent. The API has been designed to be as close as possible to how you’d describe the object to a human. An example of this is its ability to "select" parts of the model's geometry to run operations on, such as the following code that selects only the edges running along the Z-axis and fillets them.

```python
result = cq.Workplane("XY" ).box(3, 3, 0.5).edges("|Z").fillet(0.125)
```

![z edge select example](https://raw.githubusercontent.com/Irev-Dev/repo-images/main/images/Z-edge-select.png)

### [CascadeStudio](https://zalo.github.io/CascadeStudio/)
- [Repo](https://github.com/zalo/CascadeStudio)
- [Community](https://github.com/zalo/CascadeStudio/discussions)
- ~~Docs~~
- License: MIT
- [Online editor](https://zalo.github.io/CascadeStudio/)

A javascript wrapper for [OpenCascade](https://github.com/tpaviot/oce) that runs in the browser. (OpenCascade can run in the browser when compiled to web-assembly). [CadHub](https://cadhub.xyz/) integrates with CascadeStudio.

### [Curv](http://www.curv3d.org/)
- [Repo](https://github.com/curv3d/curv)
- [Community](https://groups.google.com/d/forum/curv) (mailing list)
- [Docs](https://github.com/curv3d/curv/tree/master/docs)
- License: Apache, 2.0
- ~~Online editor~~

Curv is a programming language for creating art using mathematics. It’s a 2D and 3D geometric modelling tool that supports full colour, animation and 3D printing. It was inspired by OpenSCAD and [shadertoy](https://www.shadertoy.com/).

### [DeclaraCAD](https://declaracad.com/)
- [Repo](https://github.com/codelv/declaracad)
- ~~Community~~
- [Docs](https://declaracad.com/docs/introduction/)
- License: GPL-3
- ~~Online editor~~

A declarative parametric 3D modelling program built using [OpenCASCADE](https://github.com/LaughlinResearch/pyOCCT)
and [enaml](https://github.com/nucleic/enaml/).


### [FreeCAD](https://www.freecadweb.org/)
- [Repo](https://github.com/FreeCAD/FreeCAD)
- [Community](https://forum.freecadweb.org/)
- [Docs](https://wiki.freecadweb.org/Getting_started)
- License: LGPLv2
- ~~Online editor~~

FreeCad is a more traditional CAD package that supports python scripting, Both for modelling as well as controlling the FreeCAD GUI itself. Not only that it has a built in [OpenSCAD workbench](https://wiki.freecadweb.org/OpenSCAD_Module) as well as an external [CadQuery workbench](https://wiki.freecadweb.org/CadQuery_Workbench), making it the best in this list at interoperability. FreeCAD uses OpenCascade under-the-hood.

### [ImplicitCAD](http://www.implicitcad.org/)
- [Repo](https://github.com/colah/ImplicitCAD)
- ~~Community~~
- [Docs](http://www.implicitcad.org/docs/tutorial)
- License: AGPL-3
- [Online editor](http://www.implicitcad.org/editor)

Inspired by OpenSCAD with a very similar language, implemented in Haskell and includes the ability to write definitions in Haskell, instead of just OpenSCAD, and is part of an 'almost stack' of tools including ExplicitCAD (for a GUI), and HSlice (for an STL slicer).

### [JSCAD](http://www.jscad.xyz/)
- [Repo](https://github.com/jscad/OpenJSCAD.org)
- [Community](https://openjscad.nodebb.com/)
- [Docs](https://openjscad.org/dokuwiki/doku.php?id=jscad_quick_reference)
- License: MIT
- [Online editor](https://openjscad.org/)

JSCAD (formally know as OpenJSCAD) provides a programmer’s approach to develop 3D models. In particular, this functionality is tuned towards creating precise models for 3D printing.

JSCAD provides the ability to:
- Create and manipulate 3D models, as well as 2D models
- Use JavaScript programming concepts, and libraries
- Save 3D models as STL (and other) formats

JSCAD is available as a:
- [Website](https://www.jscad.xyz/)
- Command line application for backend processing
- User application
- Set of packages (libraries) for building custom applications

JSCAD allows anyone to create 3D (or 2D) designs by combining simple shapes. And any shape can be rotated, moved, scaled, etc. Complex shapes can be saved as parts, which can used later. And the final design can be exported into various standard formats, i.e. STL, DXF, SVG, etc.

### [libfive](https://libfive.com/)
- [Repo](https://github.com/libfive/libfive)
- [Community](https://github.com/libfive/libfive/issues) (Github Issues)
- [Docs](https://libfive.com/examples/)
- License: Mozilla Public License 2.0 and GPL-2 or later
- ~~Online editor~~

Libfive is a software library and set of tools for solid modelling, especially suited for parametric and procedural design. Lisp based language, (so (you (((((can expect ) lots of parentheses))))).

### [pythonOCC](http://www.pythonocc.org/)
- [Repo](https://github.com/tpaviot/pythonocc-core)
- ~~Community~~
- [Docs](http://www.pythonocc.org/category/documentation/)
- License: LGPL-3
- [Online editor](https://mybinder.org/v2/gh/tpaviot/pythonocc-binderhub/7.4.0)

Python-based, Also uses [OpenCascade](https://github.com/tpaviot/oce).

### [RapCAD](https://gilesbathgate.com/category/rapcad/)
- [Repo](https://github.com/GilesBathgate/RapCAD)
- ~~Community~~
- ~~Docs~~
- License: GPL-3
- ~~Online editor~~

Another project inspired by OpenSCAD. The author considers key differences to be procedural vs functional programming language style, (i.e variables can be modified) and the use of arbitrary precision arithmetic throughout (meaning there are no unexpected double/float rounding errors). There is a handy [feature matrix](https://github.com/GilesBathgate/RapCAD/blob/master/doc/feature_matrix.asciidoc) between RapCAD, OpenSCAD and ImplicitCad.

### [scad-clj](https://github.com/farrellm/scad-clj)
- [Repo](https://github.com/farrellm/scad-clj)
- ~~Community~~
- ~~Docs~~ (No docs but mirrors OpenSCAD functions)
- License: EPL-1.0
- ~~Online editor~~

OpenSCAD DSL in Clojure. Functions generally mirror OpenSCAD, with a couple of notable exceptions.

### [scad-hs](https://github.com/farrellm/scad-hs)
- [Repo](https://github.com/farrellm/scad-hs)
- ~~Community~~
- ~~Docs~~ (No docs but mirrors OpenSCAD functions)
- License: BSD-3-Clause License
- ~~Online editor~~

Same author as scad-cji, he likes functional programming languages clearly.

### [sdfx](https://github.com/deadsy/sdfx)
- [Repo](https://github.com/deadsy/sdfx)
- [Community](https://github.com/deadsy/sdfx/issues)
- [Docs](https://godoc.org/github.com/deadsy/sdfx/sdf)
- License: MIT
- ~~Online editor~~

Go-based Code-CAD package that uses a signed distance functions (SDFs) kernel. Is capable of doing fillets and chamfering. The repo includes a [standard-library](https://github.com/deadsy/sdfx/tree/master/obj).

### [sdf-csg](https://github.com/wwwtyro/sdf-csg)
- [Repo](https://github.com/wwwtyro/sdf-csg)
- ~~Community~~
- [Docs](https://github.com/wwwtyro/sdf-csg)
- License: The Unlicense
- ~~Online editor~~

Generate meshes from signed distance functions and constructive solid geometry operations. This library is heavily based upon [Inigo Quilez's](https://iquilezles.org/index.html) [3D SDFs](https://iquilezles.org/www/articles/distfunctions/distfunctions.htm) article.

### [SolidPython](https://solidpython.readthedocs.io/en/latest/)
- [Repo](https://github.com/SolidCode/SolidPython)
- ~~Community~~
- [Docs](https://solidpython.readthedocs.io/en/latest/)
- License: GPL-2 or later
- ~~Online editor~~

Python-based library that wraps OpenSCAD, i.e. it outputs OpenSCAD code.

### [Tovero](https://www.gitlab.com/kavalogic-inc/tovero)
- [Repo](https://www.gitlab.com/kavalogic-inc/tovero)
- [Community](https://gitlab.com/kavalogic-inc/tovero/-/issues) (Gitlab Issues)
- [Docs](https://gitlab.com/kavalogic-inc/tovero/-/blob/master/README)
- License: LGPL-2.1 or later and GPL-2 or later
- ~~Online editor~~

Tovero is a binding of Libfive to Common Lisp, including a standalone REPL-based viewer.  Tovero can be integrated with [Clive](https://www.gitlab.com/kavalogic-inc/clive), a Common Lisp scene graph and 3D GUI, to build more complex modelling applications.

## Node editors / other

Not quiet Code-Cad, but they do embody much of the same thought process.

### [BlocksCAD](https://www.blockscad3d.com)
Looks to be unmaintained.
- [Repo](https://github.com/einsteinsworkshop/blockscad)
- [Community](https://www.blockscad3d.com)
- [Docs](https://www.blockscad3d.com/training-resources)
- License: GPL-3
- [Online editor](https://www.blockscad3d.com)

### [Dynamo](https://github.com/infeeeee/DynFreeCAD)
- [Repo](https://github.com/DynamoDS/Dynamo)
- [Community](https://forum.dynamobim.com/)
- [Docs](https://primer.dynamobim.org/)
- License: Apache 2.0
- ~~Online editor~~

Dynamo is, quite literally, what you make it. Working with Dynamo may include using the application, either in connection with other Autodesk software or not, engaging a Visual Programming process, or participating in a broad community of users and contributors. Works with [FreeCad](https://github.com/infeeeee/DynFreeCAD)


### [MakeCode](https://makecode.buildbee.com/)
- [Repo](https://github.com/buildbee/makecode)
- ~~Community~~
- [Docs](https://makecode.buildbee.com/) (tutorials)
- License: MIT
- [Online editor](https://makecode.buildbee.com/)

MakeCode's block editor supplies many great deal of helpers that make it perfect for making functional 3d prints, for example, there are functions that help stack and layout parts, as well as fillet utils (called styled edges). It also has a fast hull function (called wrap shapes). MakeCode is sponsored by [BuildBee]( https://buildbee.com).

### [Sverchok](https://github.com/nortikin/sverchok)
- [Repo](https://github.com/nortikin/sverchok)
- ~~Community~~
- [Docs](http://nikitron.cc.ua/sverch/html/main.html)
- License: GPL-3
- ~~Online editor~~

Add-on for blender. Sverchok is a powerful parametric tool for architects, allowing geometry to be programmed visually with nodes.

