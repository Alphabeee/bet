const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { DeleteUser } = require("./../Modules/Database");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("delete")
        .setDescription("deletes a user from the database")
        .addUserOption((option) =>
            option.setName("user").setDescription("target user").setRequired(true),
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(client, interaction){
        const TargetUser = interaction.options.getUser("user");
        DeleteUser(TargetUser.id).then((Status) => {
            console.log(`${Status ? "Successfully" : "Failed to"} delete <@${TargetUser.id}> from the database`);
            interaction.reply({
                content: `${Status ? "Successfully" : "Failed to"} delete <@${TargetUser.id}> from the database`
            });
            return;
        })
    }
}