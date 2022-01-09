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


Clone the repo, then `cd` in the repo and app directory (the docs directory is for [learn.cadhub](https://learn.cadhub.xyz/))
```
cd cadhub/app
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

### Discord bot setup

To set up the discord bot to notify when users publish new content (see also [the discord JS tutorial](https://discordjs.guide/preparations/setting-up-a-bot-application.html)):

1. If you're setting up the bot in a dev environment, create a new discord server (the "plus" button on the left when logged into the Discord webpage). Make note of the name of the project.
2. With [developer mode turned on](https://www.howtogeek.com/714348/how-to-enable-or-disable-developer-mode-on-discord/), right click the channel you wish the bot to announce on and select "Copy ID". Add this to `.env.defaults` as `DISCORD_CHANNEL_ID`.
3. [create a new application](https://discord.com/developers/applications), or navigate to an existing one.
4. Create a bot within that application. Copy the bot token and add it to `.env.defaults` as `DISCORD_TOKEN`.
5. Go to the "URL Generator" under "OAuth2" and create a URL with scope "bot" and text permission "Send Messages".
6. Copy the generated URL and open it in a new tab. Follow the instructions on the page to add the bot to your discord server.

When you next start CADHub, you should see in the logs `Discord: logged in as <bot name>` and you should see a startup message from the bot in the channel.

To send messages as the bot when things happen in the service, use the `sendChat` helper function:

```typescript
import { sendChat } from 'src/lib/discord'

sendChat("hello world!")
```

## Designs

In progress, though can be [seen on Figma](https://www.figma.com/file/VUh53RdncjZ7NuFYj0RGB9/CadHub?node-id=0%3A1)

## Docs
Docs are hosted at [learn.cadhub.xyz](http://learn.cadhub.xyz/). It includes a OpenSCAD tutorial at this point, and more is coming. The docs can be found in this repo at [docs](https://github.com/Irev-Dev/cadhub/tree/main/docs)
