const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("check")
    .setDescription("確認你現在有多少錢"),
  async execute(client, interaction) {
    const jsonDataIn = fs.readFileSync("players.json");
    let testData = JSON.parse(jsonDataIn);
    let is = 0;
    for (let i = 0; i < testData.length; i++) {
      if (testData[i].id == interaction.user.id) {
        is = 1;
        interaction.reply({
          content: `你現在有 ${testData[i].money}元`,
          ephemeral: true,
        });
        break;
      }
    }
    if (!is) {
      testData.push({ id: interaction.user.id, money: 500 });
      interaction.reply({
        content: `你現在有 500元`,
        ephemeral: true,
      });
    }
    const jsonDataOut = JSON.stringify(testData);
    fs.writeFileSync("players.json", jsonDataOut);
  },
};
