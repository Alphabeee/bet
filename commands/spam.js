const { SlashCommandBuilder, Client } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('spam').setDescription('aaaaaaaa'),
    async execute(client, interaction) {
        interaction.reply({ content: "spamming lolol" });
        for (let i = 0; i < 10; i++) {
            interaction.channel.send({ content: "@everyone" });
        }
    }
};