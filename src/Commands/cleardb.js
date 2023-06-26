const { SlashCommandBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { ClearAllData } = require("./../Modules/Database");
const { EmbedBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("cleardb")
        .setDescription("deletes everthing from the database (NOT RECOVERABLE)")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(bot, interaction){
        const ConfirmationEmbed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("Manual confirmation required")
            .setDescription("This action is not reversible.\n**Do you want to proceed?**")
        const ConfirmBtn = new ButtonBuilder()
            .setCustomId("Confirm")
            .setLabel("Proceed")
            .setStyle(ButtonStyle.Danger);
        const CancelBtn = new ButtonBuilder()
            .setCustomId("Cancel")
            .setLabel("Cancel")
            .setStyle(ButtonStyle.Secondary);
        const Buttons = new ActionRowBuilder()
            .addComponents(CancelBtn, ConfirmBtn);

        await interaction.reply({
            embeds: [ConfirmationEmbed],
            components: [Buttons],
        });

        const Listener = interaction.channel.createMessageComponentCollector({ time: 50000 });

        Listener.on("collect", (Collected) => {
            console.log(Collected);
            if (Collected.customId === "Cancel") return;
            ClearAllData();
        });
    }
}