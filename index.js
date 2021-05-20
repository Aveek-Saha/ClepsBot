const keep_alive = require('./keep_alive.js')
const Discord = require('discord.js');
const client = new Discord.Client();
const dotenv = require('dotenv');
dotenv.config();
const token = process.env.DISCORD_BOT_SECRET;
const prefix = '!'

client.on('ready', () => {
  console.log("I'm in");
  console.log(client.user.username);
});

client.on('message', message => {
    if (message.content.startsWith(prefix) && (message.author.id != client.user.id)) {
        const args = message.content.slice(prefix.length).trim().split(' ');
	    const command = args.shift().toLowerCase();

        if (command === 'ping') {
            message.channel.send('Pong.');
        } else if (command === 'args-info') {
            if (!args.length) {
                return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
            }
    
            message.channel.send(`Command name: ${command}\nArguments: ${args}`);
        }
    }
});

client.login(token);