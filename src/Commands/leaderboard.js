const { SlashCommandBuilder, Guild, EmbedBuilder } = require("discord.js");
const { GetAllUsers } = require("../Modules/Database.js");

module.exports = {
    data: new SlashCommandBuilder().setName("money-leaderboard").setDescription("Shows the leaderboard based on money"),

    async execute(bot, interaction) {
        GetAllUsers().then(async (data) => {
            let Embed = new EmbedBuilder()
                .setColor(0x44ff00)
                .setTitle("Top 8 Players")
                .setDescription("前八名玩家的金幣數")
                .setTimestamp();
            for (let i = 0; i < data.length; i++) {
                const { id, money, team } = data[i];
                const User = (await interaction.guild.members.fetch(id)).user;
                Embed.addFields({
                    name: `${i + 1}. @${User.username} (第 ${team} 小隊)`,
                    value: String(money),
                    inline: false,
                });
            }
            interaction.reply({ embeds: [Embed] });
            return;
        });
    },
};
