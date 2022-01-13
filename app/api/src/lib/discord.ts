import axios from 'axios'
import {Client, Intents, MessageAttachment} from "discord.js"

let inst = null;
if (!process.env.DISCORD_TOKEN || !process.env.DISCORD_CHANNEL_ID) {
  console.warn("Discord bot not configured - please set process.env.DISCORD_TOKEN and process.env.DISCORD_CHANNEL_ID to send discord chats");
} else {
  inst = axios.create({
    baseURL: 'https://discord.com/api'
  });
  inst.defaults.headers.common['Authorization'] = `Bot ${process.env.DISCORD_TOKEN}`
  console.log(`Discord: using API token ${process.env.DISCORD_TOKEN}`);
}

export async function sendDiscordMessage(text: string, url?: string) {
  if (!inst) {
    console.error(`Discord: not configured to send message ("${text}")`);
  } else {
    const API_URL = `/channels/${process.env.DISCORD_CHANNEL_ID}/messages`;
    if (url) {
      return inst.post(API_URL, { embeds: [{
        title: text,
        image: {
          url: url,
        },
      }] });
    } else {
      return inst.post(API_URL, {
          content: text,
      });
    }
  }
}

