/* eslint-disable no-console */
const { PrismaClient } = require('@prisma/client')
const dotenv = require('dotenv')

dotenv.config()
const db = new PrismaClient()

async function main() {
  // Seed data is database data that needs to exist for your app to run.
  // Ideally this file should be idempotent: running it multiple times
  // will result in the same database state (usually by checking for the
  // existence of a record before trying to create it). For example:
  //
  //   const existing = await db.user.findMany({ where: { email: 'admin@email.com' }})
  //   if (!existing.length) {
  //     await db.user.create({ data: { name: 'Admin', email: 'admin@email.com' }})
  //   }
  const users = [
    {
      id: "a2b21ce1-ae57-43a2-b6a3-b6e542fd9e60",
      userName: "local-user-1",
      name: "local 1",
      email: "localUser1@kurthutten.com"
    },
    {
      id: "682ba807-d10e-4caf-bf28-74054e46c9ec",
      userName: "local-user-2",
      name: "local 2",
      email: "localUser2@kurthutten.com"
    },
    {
      id: "5cea3906-1e8e-4673-8f0d-89e6a963c096",
      userName: "local-admin-2",
      name: "local admin",
      email: "localAdmin@kurthutten.com"
    },
  ]

  let existing
  existing = await db.user.findMany({ where: { id: users[0].id }})
  if(!existing.length) {
    await db.user.create({
      data: users[0],
    })
  }
  existing = await db.user.findMany({ where: { id: users[1].id }})
  if(!existing.length) {
    await db.user.create({
      data: users[1],
    })
  }

  const parts = [
    {
      title: 'demo-part1',
      description: '# can be markdown',
      mainImage: 'CadHub/kjdlgjnu0xmwksia7xox',
      user: {
        connect: {
          id: users[0].id,
        },
      },
    },
    {
      title: 'demo-part2',
      description: '## [hey](www.google.com)',
      user: {
        connect: {
          id: users[1].id,
        },
      },
    },
  ]

  existing = await db.part.findMany({where: { title: parts[0].title}})
  if(!existing.length) {
    await db.part.create({
      data: parts[0],
    })
  }
  existing = await db.part.findMany({where: { title: parts[1].title}})
  if(!existing.length) {
    await db.part.create({
      data: parts[1],
    })
  }



  const aPart = await db.part.findUnique({where: {
    title_userId: {
      title: parts[0].title,
      userId: users[0].id,
    }
  }})
  await db.comment.create({
    data: {
      text: "nice part, I like it",
      user: {connect: { id: users[0].id}},
      part: {connect: { id: aPart.id}},
    }
  })
  await db.partReaction.create({
    data: {
      emote: "❤️",
      user: {connect: { id: users[0].id}},
      part: {connect: { id: aPart.id}},
    }
  })

  console.info('No data to seed. See api/prisma/seeds.js for info.')
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await db.$disconnect()
  })
