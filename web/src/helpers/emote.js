export const countEmotes = (reactions) => {
  // would be good to do this sever side
  // counting unique emojis, and limiting to the 5 largest
  const emoteCounts = {}
  reactions.forEach(({emote}) => {
    emoteCounts[emote] = emoteCounts[emote] ? emoteCounts[emote] + 1 : 1
  })
  // TODO the sort is causing the emotes to jump around after the user clicks one, not ideal
  return Object.entries(emoteCounts).map(([emoji, count]) => ({emoji, count})).sort((a,b) => a.count-b.count).slice(-5)
}
