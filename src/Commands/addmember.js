const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { FindUser, CreateUser, UpdateUser, UpdateTeam } = require("./../Modules/Database.js");
const { STARTING_VALUE } = require("./../Utility/config.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("addmember")
        .setDescription("新增小隊員到小隊")
        .addUserOption((option) => option.setName("user").setDescription("小隊員的名字(@)").setRequired(true))
        .addNumberOption((option) => option.setName("team").setDescription("第幾小隊").setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(bot, interaction) {
        const Executer = interaction.user;
        const TargetUser = interaction.options.getUser("user");
        const Team = interaction.options.getNumber("team");
        FindUser(TargetUser.id).then((data) => {
            if (!data) {
                interaction.reply({
                    content: `玩家 ${TargetUser.username} 尚未被建立`,
                    ephemeral: true,
                });
                return;
            }
            UpdateTeam(Team, TargetUser.id);
            interaction.reply({
                content: `玩家 ${TargetUser.username} 已被加入第 ${Team} 小隊`,
                ephemeral: true,
            });
            return;
        });
    },
};
