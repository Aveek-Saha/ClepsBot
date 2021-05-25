const keep_alive = require("./keep_alive.js");
const Discord = require("discord.js");
const client = new Discord.Client();
const dotenv = require("dotenv");
const { makeTeams, createMessage, getUserFromMention } = require("./utils.js");

dotenv.config();
const token = process.env.DISCORD_BOT_SECRET;
const prefix = "!";

client.on("ready", () => {
  console.log(client.user.username, "is running");
});

client.on("message", (message) => {
  if (
    message.content.startsWith(prefix) &&
    (message.author.id == client.user.id || !message.author.bot)
  ) {
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === "teams") {
      if (!args.length) {
        return message.channel.send(
          `You didn't provide any arguments, ${message.author}!`
        );
      } else if (!parseInt(args[0])) {
        return message.channel.send(
          `Please provide a number, ${message.author}!`
        );
      }
      const channels = message.guild.channels.cache.filter(
        (c) => c.type === "voice"
      );
      // let users = [
      //   "anishkasi",
      //   "Wolfinthehouse",
      //   "pindabc",
      //   "aprbhd",
      //   "JakeSuli",
      //   "gopuman",
      //   "akshara",
      //   "greybeard278",
      //   "Dobby",
      // ];
      var users = [];

      for (const [channelID, channel] of channels) {
        for (const [memberID, member] of channel.members) {
          users.push(member.user.username);
        }
      }

      let mentions = args.slice(1);
      var ids = [];

      if (mentions.length) {
        var exclude = [];
        mentions.forEach((ex) => {
          var id = getUserFromMention(ex);
          ids.push(id);
          var userObj = client.users.cache.get(id);
          if (userObj) exclude.push(userObj.username);
        });
        users = users.filter((i) => exclude.indexOf(i) === -1);
      }

      ids.unshift(args[0]);
      var params = ids.join("-");

      let numTeams = parseInt(args[0]);
      let teamSize = Math.round(users.length / numTeams);
      if (teamSize <= 1)
        return message.channel.send(
          `Not enough people for this team size, ${message.author}!`
        );
      var teams = makeTeams(users, numTeams);

      var msg = createMessage(teams, params);
      message.channel.send({ embed: msg });
    }
  }
});

client.on("messageReactionAdd", async (reaction, user) => {
  if (reaction.message.partial) {
    try {
      await reaction.message.fetch();
    } catch (error) {
      console.error("Something went wrong when fetching the message: ", error);
    }
  }

  if (
    reaction.emoji.name === "🔄" &&
    reaction.message.author.id == client.user.id
  ) {
    var text = reaction.message.embeds[0].fields
      .pop()
      .value.match(/\`\`\`(.*?)\n/i)[1]
      .split("-");
    var numTeams = text[0];
    let mentions = text.slice(1);
    let command = ["!teams", numTeams];
    mentions = mentions.map((line) => `<@${line}>`);
    command.push(...mentions);

    reaction.message.channel.send(command.join(" "));
  }
  console.log(`${user.username} reacted with "${reaction.emoji.name}".`);
});

client.login(token);
