const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const fs = require("fs");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("chg")
    .setDescription("change money")
    .addUserOption((option) =>
      option.setName("user").setDescription("user").setRequired(true)
    )
    .addNumberOption((option) =>
      option.setName("number").setDescription("user").setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(client, interaction) {
    const jsonDataIn = fs.readFileSync("players.json");
    let testData = JSON.parse(jsonDataIn);
    const is = 0;
    const u = interaction.options.getUser("user");
    for (let i = 0; i < testData.length; i++) {}
  },
};
