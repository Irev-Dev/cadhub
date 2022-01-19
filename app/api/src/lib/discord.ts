import { Client, Intents, MessageAttachment } from 'discord.js'

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
})

export async function sendDiscordMessage(text: string, url?: string) {
  if (!client.isReady()) {
    console.error(`Discord: client is not ready to send message ("${text}")`)
  } else {
    const channel = await client.channels.fetch(process.env.DISCORD_CHANNEL_ID)
    if (url) {
      channel.send({
        embeds: [
          {
            title: text,
            image: {
              url: url,
            },
          },
        ],
      })
    } else {
      channel.send(text)
    }
  }
}

client.on('ready', async () => {
  console.log(`Discord: logged in as ${client.user.tag}`)
})

if (!process.env.DISCORD_TOKEN || !process.env.DISCORD_CHANNEL_ID) {
  console.warn(
    'Discord bot not configured - please set process.env.DISCORD_TOKEN and process.env.DISCORD_CHANNEL_ID to send discord chats'
  )
} else {
  console.log(`Discord: logging in (token ${process.env.DISCORD_TOKEN})`)
  client.login(process.env.DISCORD_TOKEN)
}
