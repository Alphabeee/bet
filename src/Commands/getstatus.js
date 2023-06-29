const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { FindUser, CreateUser, UpdateUser } = require("../Modules/Database.js");
const { STARTING_VALUE } = require("../Utility/config.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("getstatus")
        .setDescription("得到小隊員的錢錢")
        .addUserOption((option) => option.setName("user").setDescription("要查看的小隊員的名字(@)").setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(bot, interaction) {
        const TargetUser = interaction.options.getUser("user");
        const data = await FindUser(TargetUser.id);

        if (!data) {
            await interaction.reply({
                content: `玩家 ${TargetUser.username} 尚未被建立`,
                ephemeral: true,
            });
            return;
        }
        await interaction.reply({
            content: `玩家 ${TargetUser.username} 現有 ${data.money} 代幣`,
            ephemeral: true,
        });
        return;
    },
};
