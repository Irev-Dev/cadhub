Hello 👋


Really happy you're checking out how to contribute.
Here you'll find a break down of the tech we're using,

If you'd like to get involved one of the best ways is to drop by the [discord](https://discord.gg/SD7zFRNjGH), say hi and let us know you're interested in contributing. All are welcome.

## Tech used

### Redwood
CadHub is a [RedWood app](https://redwoodjs.com/). Simplistically this means it's a React frontend, using a serverless graphQL backend with Prisma.
We are also using [Tailwind](https://tailwindcss.com/) to style the app.
To learn more about Redwood, here are some useful links:
- [Tutorial](https://redwoodjs.com/tutorial/welcome-to-redwood): getting started and complete overview guide.
- [Docs](https://redwoodjs.com/docs/introduction): using the Redwood Router, handling assets and files, list of command-line tools, and more.
- [Redwood Community](https://community.redwoodjs.com): get help, share tips and tricks, and collaborate on everything about RedwoodJS.

### Cad Packages
Because Each CadPackage is it's own beast we opted to use Docker in order to give us lots of flexibility for setting up the environment to run there packages. The containers are run using AWS's container lambda and deployed using the serverless framework (JSCAD is an exception since it runs client-side). See [our docs](https://learn.cadhub.xyz/docs/general-cadhub/integrations) for more information of how this is setup.

## Getting your dev environment setup


Clone the repo and `cd` in the app directory (the docs directory is for [learn.cadhub](https://learn.cadhub.xyz/))
```
cd app
```

Install dependencies
```terminal
yarn install
```

Setting up the db, you'll need to have a postgres installed locally, you can [follow this guide](https://redwoodjs.com/docs/local-postgres-setup).

Run the following
``` terminal
yarn rw prisma migrate dev
yarn rw prisma db seed
```

p.s. `yarn rw prisma studio` spins up an app to inspect the db

### Fire up dev
```terminal
yarn rw dev
```

Your browser should open automatically to `http://localhost:8910` to see the web app. Lambda functions run on `http://localhost:8911` and are also proxied to `http://localhost:8910/.redwood/functions/*`.

If you want to access the websight on your phone use `yarn redwood dev --fwd="--host <ip-address-on-your-network-i.e.-192.168.0.5>"`

you can sign in to the following accounts locally

localUser1@kurthutten.com: `abc123`

localUser2@kurthutten.com: `abc123`

localAdmin@kurthutten.com: `abc123`

## Designs

In progress, though can be [seen on Figma](https://www.figma.com/file/VUh53RdncjZ7NuFYj0RGB9/CadHub?node-id=0%3A1)

## Docs
Docs are hosted at [learn.cadhub.xyz](http://learn.cadhub.xyz/). It includes a OpenSCAD tutorial at this point, and more is coming. The docs can be found in this repo at [docs](https://github.com/Irev-Dev/cadhub/tree/main/docs)
