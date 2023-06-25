const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const fs = require("fs");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("chg")
    .setDescription("更新小隊員的錢錢")
    .addUserOption((option) =>
      option.setName("user").setDescription("要更改的小隊員的名字(@)").setRequired(true)
    )
    .addNumberOption((option) =>
      option.setName("number").setDescription("要增加或減少的金額(減少請加負號)").setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(client, interaction) {
    if (interaction.guild.id !== '1078852228934271026') return interaction.reply('This command can only be used in another server.');
    const jsonDataIn = fs.readFileSync("players.json");
    let testData = JSON.parse(jsonDataIn);
    let is = 0;
    const u = interaction.options.getUser("user");
    const n = interaction.options.getNumber("number");
    for (let i = 0; i < testData.length; i++) {
      if (testData[i].id == u.id) {
        testData[i].money += n;
        is = 1;
        interaction.reply({
          content: `Sucessful add/minus ${n}$`,
          ephemeral: true,
        });
      }
    }
    if (!is) {
      testData.push({ id: interaction.user.id, money: 500 });
      interaction.reply({
        content: `Sucessful add/minus ${n}$`,
        ephemeral: true,
      });
    }
    const jsonDataOut = JSON.stringify(testData);
    fs.writeFileSync("players.json", jsonDataOut);
  },
};
