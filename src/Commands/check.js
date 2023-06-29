const { FindUser, CreateUser } = require("./../Modules/Database.js");
const { STARTING_VALUE } = require("./../Utility/config.js");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("check").setDescription("確認你現在有多少錢"),

    async execute(bot, interaction) {
        const User = interaction.user;
        FindUser(User.id).then((data) => {
            if (!data) {
                console.log(`Failed to find user, creating user with id ${User.id}!`);
                CreateUser(User.id);
                interaction.reply({
                    content: `你現在有 ${STARTING_VALUE} 代幣`,
                    ephemeral: true,
                });
                return;
            }
            interaction.reply({
                content: `你現在有 ${data.money} 代幣`,
                ephemeral: true,
            });
            return;
        });
    },
};
