![CadHub banner](https://raw.githubusercontent.com/Irev-Dev/repo-images/main/images/gear%20donutbanner.png)

# [C a d H u b](https://cadhub.xyz)

[![Netlify Status](https://api.netlify.com/api/v1/badges/77f37543-e54a-4723-8136-157c0221ec27/deploy-status)](https://app.netlify.com/sites/cadhubxyz/deploys)

Let's help Code-CAD reach its [full potential!](https://cadhub.xyz) We're making a ~~cad~~hub for the Code-CAD community, think of it as model-repository crossed with a live editor. We have an integration with the excellent [cascadeStudio](https://zalo.github.io/CascadeStudio/) with [more coming soon](https://github.com/Irev-Dev/curated-code-cad).

If you want to be involved in anyway, get in touch via, [twitter](https://twitter.com/IrevDev), [discord](https://discord.gg/SD7zFRNjGH) or [discussions](https://github.com/Irev-Dev/cadhub/discussions).

<img src="https://raw.githubusercontent.com/Irev-Dev/repo-images/main/images/fullcadhubshot.jpg">

<img src="https://raw.githubusercontent.com/Irev-Dev/repo-images/main/images/Part%20IDE%20-%20export%20expand%20state.jpg">

## Getting Started

Because we're integrating cascadeStudio, this is done some what crudely for the time being, so you'll need to clone the repo with submodules.

```terminal
git clone --recurse-submodules -j8 git@github.com:Irev-Dev/cadhub.git
# or
git clone --recurse-submodules -j8 https://github.com/Irev-Dev/cadhub.git
```

Install dependencies
```terminal
yarn install
```

Initialise the db
``` terminal
yarn rw db up
yarn rw db seed
```

Move some files to the public directory
```
yarn move-cad-worker
```
The above step should be repeated whenever you modify anything in the git submodule `web/src/cascade/*`

### Fire up dev
```terminal
yarn rw dev
```

Your browser should open automatically to `http://localhost:8910` to see the web app. Lambda functions run on `http://localhost:8911` and are also proxied to `http://localhost:8910/.redwood/functions/*`.

you can sign in to the following accounts locally

localUser1@kurthutten.com: `abc123`

localUser2@kurthutten.com: `abc123`

localAdmin@kurthutten.com: `abc123`

You may need to register a account depending on what issue you are trying to tackle, This can be done by clicking the login button on the top right. This will open up netlify's idenitiy modal asking for the websites url, since it will notice you developing locally. Enter `https://cadhub.xyz/` than use you email, verify your email and you should be set.
(some routes are protected, but permissions is a big area that needs a lot of work in the near future, so it's in a very incomplete state atm)

### Note:
We're using [RedwoodJS](https://redwoodjs.com/), this is perhaps unwise since they haven't reached 1.0 yet, however with their aim to release 1.0 by the end of the year, it shouldn't be too difficult to port changes over the coming months.
If you not familiar with Redwood, never fear the main bit of tech it uses is React, Graphql(apollo) and serverless/lamdas, depending on what part of the app you want to help with, so long as you know you way around these bits of tech you should be fine with some light referencing of the RedWood docs

### Extra Redwood docs, i.e. getting familiar with the frame work.
- [Tutorial](https://redwoodjs.com/tutorial/welcome-to-redwood): getting started and complete overview guide.
- [Docs](https://redwoodjs.com/docs/introduction): using the Redwood Router, handling assets and files, list of command-line tools, and more.
- [Redwood Community](https://community.redwoodjs.com): get help, share tips and tricks, and collaborate on everything about RedwoodJS.

## Styles

We're using tailwind utility classes so please try and use them as much as possible. Again if you not familiar, the [tailwind search](https://tailwindcss.com/) is fantastic, so searching for the css property you want to use will lead you to the correct class 99% of the time.

## Designs

In progress, though can be [seen on Figma](https://www.figma.com/file/VUh53RdncjZ7NuFYj0RGB9/CadHub?node-id=0%3A1)

<img src="https://raw.githubusercontent.com/Irev-Dev/repo-images/main/images/Part%20Page(1).jpg">

<img src="https://raw.githubusercontent.com/Irev-Dev/repo-images/main/images/User%20Page%20Edit.jpg">
