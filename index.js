const keep_alive = require('./keep_alive.js')
const Discord = require('discord.js');
const client = new Discord.Client();
const dotenv = require('dotenv');
const { FisherYates } = require('js-data-structs');

dotenv.config();
const token = process.env.DISCORD_BOT_SECRET;
const prefix = '!'

function makeTeams(users, numTeams) {
    let random = FisherYates(users);
    let teams = []
    for (let i = 0; i < numTeams; i++) {
        teams.push([])
    }
    random.forEach((user, index) => {
        teams[index % numTeams].push(user)
    });

    return teams
}

function numToAlpha(num){
    var s = '', t;
  
    while (num > 0) {
      t = (num - 1) % 26;
      s = String.fromCharCode(65 + t) + s;
      num = (num - t)/26 | 0;
    }
    return s || undefined;
  }

function createMessage(teams) {
    var fields = []
    teams.forEach((team, index) => {
        fields.push({ name: `__Team ${numToAlpha(index + 1)}__`, value: `**${team.join('\n')}**` })
    });
    const exampleEmbed = {
        color: 0x0099ff,
        title: 'Teams Generated',
        fields: fields
    };

    return exampleEmbed
}

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
            // var users = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]

            for (const [channelID, channel] of channels) {
                for (const [memberID, member] of channel.members) {
                    users.push(member.user.username)
                }
              }

              let numTeams = parseInt(args[0])
              let teamSize = Math.round(users.length/numTeams);
              if (teamSize <= 1) 
                return message.channel.send(`Not enough people for this team size, ${message.author}!`);
              var teams = makeTeams(users, numTeams)
              
              console.log(teams);
              var msg = createMessage(teams)
            message.channel.send({ embed: msg });
        }
    }
});

client.login(token);