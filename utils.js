const { FisherYates } = require("js-data-structs");

function numToAlpha(num) {
  var s = "",
    t;

  while (num > 0) {
    t = (num - 1) % 26;
    s = String.fromCharCode(65 + t) + s;
    num = ((num - t) / 26) | 0;
  }
  return s || undefined;
}

module.exports = {
  makeTeams(users, numTeams) {
    let random = FisherYates(users);
    let teams = [];
    for (let i = 0; i < numTeams; i++) {
      teams.push([]);
    }
    random.forEach((user, index) => {
      teams[index % numTeams].push(user);
    });

    return teams;
  },
  createMessage(teams, params) {
    var fields = [];
    teams.forEach((team, index) => {
      fields.push({
        name: `__Team ${numToAlpha(index + 1)}__`,
        value: `**${team.join("\n")}**`,
      });
    });
    var hidden = {
      name: "React: 🔄",
      value: "```" + params + "\n Remake teams```",
    };
    fields.push(hidden);
    const exampleEmbed = {
      color: 0x0099ff,
      title: "Teams Generated",
      fields: fields,
    };

    return exampleEmbed;
  },
  getUserFromMention(mention) {
    if (!mention) return;

    if (mention.startsWith("<@") && mention.endsWith(">")) {
      mention = mention.slice(2, -1);

      if (mention.startsWith("!")) {
        mention = mention.slice(1);
      }

      return mention;
    }
  },
};
