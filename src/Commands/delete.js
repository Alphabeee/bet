const { SlashCommandBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder} = require("discord.js");
const { DeleteUser } = require("./../Modules/Database");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("delete")
        .setDescription("deletes a user from the database")
        .addUserOption((option) =>
            option.setName("user").setDescription("target user").setRequired(true),
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(bot, interaction){
        const TargetUser = interaction.options.getUser("user");

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

        const ConfirmationEmbedMessage = await interaction.reply({
            embeds: [ConfirmationEmbed],
            components: [Buttons],
        });

        const Listener = interaction.channel.createMessageComponentCollector({ time: 50000 });

        Listener.on("collect", (Collected) => {
            if (Collected.customId === "Cancel") return;
            DeleteUser(TargetUser.id).then((Status) => {
                console.log(`${Status ? "Successfully" : "Failed to"} delete <@${TargetUser.id}> from the database`);
                const CompletedEmbed = new EmbedBuilder()
                    .setColor(0x27de0b)
                    .setTitle("Action Completed")
                    .setDescription(`${Status ? "Successfully" : "Failed to"} delete <@${TargetUser.id}> from the database`)
                    .setTimestamp()
                interaction.editReply({ embeds: [CompletedEmbed], components: []});
                return;
            });
        });
        
    }
}