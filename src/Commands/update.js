const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { FindUser, CreateUser, UpdateUser } = require("./../Modules/Database.js");
const { STARTING_VALUE } = require("./../Utility/config.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("update")
        .setDescription("更新小隊員的錢錢")
        .addUserOption((option) => option.setName("user").setDescription("要更改的小隊員的名字(@)").setRequired(true))
        .addNumberOption((option) =>
            option.setName("number").setDescription("要增加或減少的金額(減少請加負號)").setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(bot, interaction) {
        const Executer = interaction.user;
        const TargetUser = interaction.options.getUser("user");
        const NewValue = interaction.options.getNumber("number");
        FindUser(TargetUser.id).then((data) => {
            if (!data) {
                CreateUser(TargetUser.id);
                if (NewValue + data.money < 0) {
                    interaction.reply({
                        content: `玩家 ${TargetUser.username} 沒錢了 QQ，他剩下${data.money} 代幣`,
                        ephemeral: true,
                    });
                    return;
                }
                const NewMoneyVal = STARTING_VALUE + NewValue;
                interaction.reply({
                    content: `玩家 ${TargetUser.username} ${NewValue >= 0 ? "加" : "減"} ${
                        NewValue < 0 ? -NewValue : NewValue
                    } 代幣 現有 ${NewMoneyVal} 代幣${NewValue == 0 ? " 所以為什麽要這樣做..." : ""}`,
                    ephemeral: true,
                });
                UpdateUser(TargetUser.id, NewMoneyVal);
                return;
            }
            if (data.money + NewValue < 0) {
                interaction.reply({
                    content: `玩家 ${TargetUser.username} 沒錢了 QQ，他剩下${data.money} 代幣`,
                    ephemeral: true,
                });
                return;
            }
            interaction.reply({
                content: `玩家 ${TargetUser.username} ${NewValue >= 0 ? "加" : "減"} ${
                    NewValue < 0 ? -NewValue : NewValue
                } 代幣 現有 ${data.money + NewValue} 代幣${NewValue == 0 ? " 但是。。。為什麽。。。？" : ""}`,
                ephemeral: true,
            });
            UpdateUser(TargetUser.id, data.money + NewValue);
            return;
        });
    },
};
