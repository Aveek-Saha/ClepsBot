const keep_alive = require('./keep_alive.js')
const Discord = require('discord.js');
const client = new Discord.Client();
const dotenv = require('dotenv');
const { FisherYates } = require('js-data-structs');

dotenv.config();
const token = process.env.DISCORD_BOT_SECRET;
const prefix = '!'

client.on('ready', () => {
  console.log(client.user.username, "is running");
});

client.on('message', message => {
    if (message.content.startsWith(prefix) && (message.author.id != client.user.id)) {
        const args = message.content.slice(prefix.length).trim().split(/ +/);
	    const command = args.shift().toLowerCase();

        if (command === 'teams') {
            if (!args.length) {
                return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
            } else if (!parseInt(args[0])) {
                return message.channel.send(`Please provide a number, ${message.author}!`);
            }
            const channels = message.guild.channels.cache.filter(c => c.type === 'voice');
            let users = ['anishkasi', 'Wolfinthehouse', 'pindabc', 'aprbhd', 'JakeSuli', 'gopuman', 'akshara', 'greybeard278', 'Dobby']
            for (const [channelID, channel] of channels) {
                for (const [memberID, member] of channel.members) {
                    users.push(member.user.username)
                }
              }
              console.log(FisherYates(users));
            message.channel.send(`First argument: ${args[0]}`);
        }
    }
});

client.login(token);