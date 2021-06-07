---
slug: openscad-review
title: OpenSCAD Review - Worth learning?
author: Kurt Hutten
author_title: CadHub Core Team
author_url: https://github.com/Irev-Dev
author_image_url: https://avatars.githubusercontent.com/u/29681384?v=4
tags: ['OpenSCAD']
---

This is an:

- Overview of OpenScad and where it fits in with other cad packages.
- What's it good for and not so good for,
- And whether I think it's worth learning.

Checkout out the [video version here](https://www.youtube.com/watch?v=_uVCD7_j-L8&t=2s).

<!--truncate-->

OpenScad is a CAD or computer-aided-design package. In a nutshell, it's software for making 3d models that are dimensional and mechanical in nature, as opposed 3d graphics software like blender, which is better suited for artistic endeavours like assets for a game, as an example.

Since OpenScad is cad software, it's amongst packages like fusion 360, Inventor, Freecad, Onshape and many more. The point of difference though for OpenScad, is that it's all programmed. Every part of the model comes from text you write, and the GUI part of the software is only there to inspect your model.

This is worlds apart from the click and drag nature of the other packages. The programmed nature of OpenScad gives it some unique advantages that have resulted in somewhat of a cult following for the software, but also some severe drawbacks.

# Let's start with its pros.

## 1) It's Opensource
OpenSCAD is free, open-source software that you can download and run on your machine and do whatever you want with. You don't need an account; there's no vendor lock-in or licensing issues. Also OpenScad files are likely very robust and will continue for work for many years.

## 2) Community libraries
Being opensource means there's a great open-source community with many libraries available that can help make you more productive or open up new possibilities.

## 3) Fostering community
Parts being 100% code is a significant benefit to the community, as hosting code on Github is a very robust way of making community contributions, as it goes through the same process software would, without awkwardly trying to pass around save files when changes are made.

## 4) It Hits a niche
OpenSCAD is very intuitive for those that come from a programming background.

## 5) Power of a programming language
There are some creative and straight-up wacky things you can do when you have a programming language at your disposal that otherwise wouldn't be possible. Also because it's all code, there are creative ways that it can be fed into a pipeline. A real-world example is [Thingiverse's customizer](https://makerware.thingiverse.com/apps/customizer) that allows you to edit variables for Openscad models uploaded to the site and download the resulting STLs.

## 6) Parametric to the core
Most cad packages these days are parametric. Loosely that means that as they're modelled, they're given dimensions along the way that can be changed later and have the model adjust itself. An example might be a bearing housing that's made for a particular sized bearing, if you want to bump up the size by a few millimetres it shouldn't be a problem, but as you can imagine there would be limits to this. If the bearing is made twice the size of the rest of the model, then the resulting shape is probably not going to work if it's not out-right broken. This is true for OpenScad too, though, with the power of a programming language, you're able to put whatever logic into the model to help it deal with extreme values if that's needed. Going so far to completely re-arrange the model to make things work if need be.

## 7) Beginner-friendly language
The language is fairly simple and therefore easy to pick up. This makes it a friendly first programming language for those looking to learn. Learning a skill that can outlive your use of the software is a great side-benefit. And the visual nature of the code results in rapid and satisfying feedback. Couple that with the fact you're making solid models that can be 3d printed and you get an experience that's tangible, I mean physically tangible in ways that other languages can't compete with. That makes it particularly compelling for getting kids into programming, which I think is fantastic.

# Now for the cons:

## 1) Unintuitive CAD interface
The fact is that for most people, coding up a part is not intuitive, because 3d modelling is inherently very visual, a graphical interface is better, at least for getting started.

## 2) Complex shapes can be challenging
This largely stems from the fact that the core process of making parts in OpenScad is with boolean operations of primitive shapes, that is union, difference and intersection. This paradigm of modelling doesn't lend itself particularly well to smooth transitions, flowing curves or even something trivial in other packages like adding a fillet is difficult. This can be somewhat alleviated with the help of other libraries, but it's still a firm con of the software.

## 3) Time-consuming
This follows on from the last point as they are connected, the difficulty of modelling complex parts means more tinkering is needed to get what you what.

## 4) The language is limiting
It might seem ironic that I'm now criticising the language since I put it in the pro list for being easy to pick up, but that's the flip side of its simple nature. OpenScad is it's own language and generally, I think rolling your own language for a project is treacherous. On the one hand, you might be able to design the language to meet the specific needs of the project very well. But on the other hand, you have to re-invent the wheel for so many things that are common to all programming languages. Effectively, the project is building two things at once that it has to get right, their software and a language. Further, if it had instead been built on top of another language then it would also be possible for users to take advantage of libraries that already exist, say math libraries. In fairness, if the project had been built on another language, it would likely make it less beginner-friendly. Because even if beginners only needed to know a small subset of the language to get started, They could still easily get lost in all of the existing documentation for that language.

I think my biggest problem with OpenScad rolling their own language is without a lot of resources it's inevitable that the language would be sub-par with what developers are used to. Sure OpenScad is bound to have fewer features than other languages, that's fine but even what has been implemented feels a little janky. Functions aren't intuitive and defining scoped variables within them feels janky. For-loops are weird too, and re-assigning variables doesn't cause errors but easily lead to bugs as it's behaviour is counter-intuitive.

## 5) Lacking mature features
There are features that OpenScad lacks like FEM or CAM. but I'd label these as specialised features and not mature features, as it's not like every CAD package includes these, and it's reasonable for OpenScad to focus just the modelling stage of a part's lifecycle. My point is simply it's not a big deal these feature's aren't there, and I don't think OpenScad suffers because of it. What's more of a problem though is limited file format compatibility. OpenScad's lack of support for STEP files in particular, as they are an industry standard for manufacturing. If you want to move beyond 3d printing and start getting parts made with injection moulding, then you might need to redo parts in another package. From what I understand, STEP files are very difficult for OpenScad for historic reasons.

Something worth considering though under the theme of "mature features" is "are there companies using OpenScad?" Hard to say but I certainly don't know of many. Prusa did use OpenScad for their printers, in fact all the scad files for their mk2 printer are up on github. Though if you look at their latest printer's github (prusa-mini), the files are all .ipt or inventor files. That doesn't mean they never use OpenScad now, but it is a sign that they've found it prudent to move away from it somewhat.

# Closing thoughts
With all of that out of the way, my answer to the question of should you learn OpenSCAD my short answer is yes, and my long answer is it depends, and the best way for me to break down the long answer is to propose some scenarios.

- If you are a programmer then go ahead, you'll probably enjoy it.
- If you are interested in learning to code, then OpenScad is a pretty gentle introduction. There are plenty of programming concepts that you will never learn in OpenScad, but they can come later with the next language.
- If you want to make parts that are very robust to changing parameters and want to be able to host it on Thingiverse, where users can put in their own parameters, then OpenSCAD is the only option available.
- If you like the concept of OpenSCAD, whether that's the code, fostering community contributions, or lack of vendor lock-in, and you are making parts to be 3d printed, then OpenSCAD is a solid choice.

However, if you need to be productive today, or need to support STEP files for manufacturing, or need to make very complex shapes with smooth flowing meshes, then you'll be battling against OpenScad to get it to do what you need and would be a poor choice.

Some other things to consider before you make your choice are:

- If the lack of vendor lock in, and opensource nature is appealing to you, then you could always consider other open-source CAD packages like FreeCad.
- If you love the idea of programming-CAD, while OpenScad is the most popular, there are alternatives. SolidPython is a python wrapper for OpenSCAD, or one of my favourites is jsCAD. It's implemented in javascript, and models can be made right in the browser.
- If you're worried about what I said about it being difficult to make complex shapes, have a look at libraries that are available first, as it should give you a good idea of the kinds of parts you can produce. The libraries officially recommended by OpenScad are an excellent place to start, but if I may, I'll plug my library, Round-Anything. The library has a variety of features, but what I think is of most significance is offering a way to add rounding to polygons. The result is a move away from the "boolean with primitives" paradigm, towards the sketch and extrude paradigm, which is, in my opinion, the workhorse of more traditional cad packages.

One interesting take-away from everything I've said thus far is that even with some pretty heavy criticism of the software, I still recommend it for a variety of situations. This speaks to how well OpenScad fills a niche, and I think that means that the software will continue to be used and loved for many years to come.
