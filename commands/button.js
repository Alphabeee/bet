const { SlashCommandBuilder, Client } = require('discord.js');
const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('button').setDescription('buttons test'),
    async execute(client, interaction) {

        const buttonA = new ButtonBuilder().setStyle(ButtonStyle.Primary).setCustomId('buttonA').setLabel('buttonA');

        const buttonB = new ButtonBuilder().setStyle(ButtonStyle.Link).setURL('https://reurl.cc/a1eXv9').setLabel('secret link');

        const buttonC = new ButtonBuilder().setStyle(ButtonStyle.Success).setCustomId('buttonC').setEmoji('852071111926611978');

        const buttonD = new ButtonBuilder().setStyle(ButtonStyle.Primary).setCustomId('buttonD').setLabel('buttonD');

        const rowA = new ActionRowBuilder().addComponents(buttonA, buttonB);

        const rowB = new ActionRowBuilder().addComponents(buttonC, buttonD);

        interaction.reply({ content: 'buttons demo here!', components: [rowA, rowB] });

        const collectorA = interaction.channel.createMessageComponentCollector({ time: 15000 });

        collectorA.on('collect', collected => {

            console.log(collected);

            if (collected.customId == "buttonA") {

                collected.update({ content: `${collected.user.username} pressed ${collected.customId}!`, components: [] });

                interaction.followUp({ content: "OwO" });

            } else if (collected.customId == "buttonD") {

                collected.reply({ content: `${collected.user.username} pressed ${collected.customId}!`, components: [] });

                interaction.followUp({ content: "OwO" });

                interaction.followUp({ content: "OwO" });

            }

            collectorA.stop();

        });

    }
};
