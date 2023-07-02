const { GetAllTeamStatistic } = require("./../Modules/Database.js");
const { STARTING_VALUE } = require("./../Utility/config.js");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("statistic").setDescription("統計各小隊的錢錢"),

    async execute(bot, interaction) {
        const User = interaction.user;
        // sum up all the money, using group by team
        GetAllTeamStatistic().then(async (data) => {
            let Embed = new EmbedBuilder()
                .setColor(0x44ff00)
                .setTitle("小隊排行榜")
                .setDescription("各小隊金幣數排行")
                .setTimestamp();
            for (let i = 0; i < data.length; i++) {
                const { team, sum_money } = data[i];
                Embed.addFields({ name: `${i + 1}. 第 ${team} 小隊`, value: String(sum_money), inline: false });
            }
            interaction.reply({ embeds: [Embed] });
            return;
        });
    },
};
