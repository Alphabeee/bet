const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("chk")
    .setDescription("check how much money do you have."),
  async execute(client, interaction) {
    const jsonDataIn = fs.readFileSync("players.json");
    let testData = JSON.parse(jsonDataIn);
    const is = 0;
    for (let i = 0; i < testData.length; i++) {
      if (testData[i].userid == interaction.user.id) {
        is = 1;
        interaction.reply({
          content: `You have ${testData[i].money}$.`,
          ephemeral: true,
        });
      }
    }
    if (!is) {
      const newplayer = { id: interaction.user.id, money: 500 };
      testData.push(newplayer);
      const jsonDataOut = JSON.stringify(testData);
      fs.writeFileSync("players.json", jsonDataOut);
      interaction.reply({
        content: `You have 500$.`,
        ephemeral: true,
      });
    }
  },
};
