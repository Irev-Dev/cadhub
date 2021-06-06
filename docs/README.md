# CadHub Docs

Our docs are built using [Docusaurus 2](https://v2.docusaurus.io/).

The docs also contains a blog, if you have a good idea for a blog post that's Code-CAD relate, please pitch it to us.

## Installation

```console
yarn install
```

## Local Development

```console
yarn start
```

This command starts a local development server and open up a browser window. Most changes are reflected live without having to restart the server.
Note there is a [bug](https://github.com/facebook/docusaurus/issues/4588) in the ideal-image plugin that means images are blurry in dev with a huge margin below each one. annoyingly enough the Github issue has been label as a feature not a bug.

To see the images properly in dev run `yarn build && yarn serve` instead, you'll have to run this each change.

## Build

```console
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.


