const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("chk")
    .setDescription("確認自己有多少錢錢"),
  async execute(client, interaction) {
    const jsonDataIn = fs.readFileSync("players.json");
    let testData = JSON.parse(jsonDataIn);
    let is = 0;
    for (let i = 0; i < testData.length; i++) {
      if (testData[i].id == interaction.user.id) {
        is = 1;
        interaction.reply({
          content: `You have ${testData[i].money}$.`,
          ephemeral: true,
        });
      }
    }
    if (!is) {
      testData.push({ id: interaction.user.id, money: 500 });
      interaction.reply({
        content: `You have 500$.`,
        ephemeral: true,
      });
    }
    const jsonDataOut = JSON.stringify(testData);
    fs.writeFileSync("players.json", jsonDataOut);
  },
};
