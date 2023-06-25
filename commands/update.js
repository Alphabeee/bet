const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const fs = require("fs");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("update")
        .setDescription("更新小隊員的錢錢")
        .addUserOption((option) =>
            option.setName("user").setDescription("要更改的小隊員的名字(@)").setRequired(true),
        )
        .addNumberOption((option) =>
            option
                .setName("number")
                .setDescription("要增加或減少的金額(減少請加負號)")
                .setRequired(true),
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(client, interaction) {
        const jsonDataIn = fs.readFileSync("players.json");
        let testData = JSON.parse(jsonDataIn);
        let is = 0;
        const u = interaction.options.getUser("user");
        const n = interaction.options.getNumber("number");
        for (let i = 0; i < testData.length; i++) {
            if (testData[i].id == u.id) {
                is = 1;
                if (testData[i].money + n < 0) {
                    interaction.reply({
                        content: `玩家${u.username} 沒有錢了 剩下${testData[i].money}元`,
                        ephemeral: true,
                    });
                    break;
                }
                testData[i].money += n;
                if (n > 0) {
                    interaction.reply({
                        content: `玩家${u.username} 加${n}元 現有${testData[i].money}元`,
                        ephemeral: true,
                    });
                } else if (n < 0) {
                    interaction.reply({
                        content: `玩家${u.username} 減${-n}元 現有${testData[i].money}元`,
                        ephemeral: true,
                    });
                } else {
                    interaction.reply({
                        content: `玩家${u.username} 加0元 現有${500 + n}元 所以為什麼要這樣做`,
                        ephemeral: true,
                    });
                }
                break;
            }
        }
        if (is != 1) {
            testData.push({ id: interaction.user.id, money: 500 + n });
            if (n < -500) {
                interaction.reply({
                    content: `玩家${u.username} 沒有錢了 現有${500}元`,
                    ephemeral: true,
                });
                testData[testData.length].money = 500;
            } else if (n > 0) {
                interaction.reply({
                    content: `玩家${u.username} 加${n}元 現有${500 + n}元`,
                    ephemeral: true,
                });
            } else if (n < 0) {
                interaction.reply({
                    content: `玩家${u.username} 減${-n}元 現有${500 + n}元`,
                    ephemeral: true,
                });
            } else {
                interaction.reply({
                    content: `玩家${u.username} 加0元 現有${500 + n}元 所以為什麼要這樣做`,
                    ephemeral: true,
                });
            }
        }
        const jsonDataOut = JSON.stringify(testData);
        fs.writeFileSync("players.json", jsonDataOut);
    },
};

