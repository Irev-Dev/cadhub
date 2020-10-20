# CadHub

CadHub aims to be a community website for javascript based code-cad. Currently trying to integrate [cascadeStudio](https://zalo.github.io/CascadeStudio/), but if successful plan to also integrate [jsCad](https://openjscad.org/).
OpenScad has proven code-cad a much loved formate for cad-modeling. Joining code-cad to a mature language like javascript that has a package manager (npm) plus a community hub for sharing cad models like CadHub, we're going to build a thriving community.

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

### Fire up dev
```terminal
yarn rw dev
```

Your browser should open automatically to `http://localhost:8910` to see the web app. Lambda functions run on `http://localhost:8911` and are also proxied to `http://localhost:8910/.redwood/functions/*`.

You may need to register a account depending on what issue you are trying to tackle, This can be done by clicking the login button on the top right.
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
