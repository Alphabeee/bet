const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Client } = require('discord.js');
const fs = require('node:fs');

module.exports = {
    data: new SlashCommandBuilder().setName('double').setDescription('2 player janken!'),
    async execute(client, interaction) {

        //建立 embed 和剪刀石頭布的三個 button
        const buttonEmbed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle(`來猜拳！`);

        const scissorButton = new ButtonBuilder()
            .setCustomId('scissors')
            .setLabel('✌️')
            .setStyle(ButtonStyle.Primary);

        const rockButton = new ButtonBuilder()
            .setCustomId('rock')
            .setLabel('✊')
            .setStyle(ButtonStyle.Primary);

        const paperButton = new ButtonBuilder()
            .setCustomId('paper')
            .setLabel('🖐️')
            .setStyle(ButtonStyle.Primary);

        //將三個 button 都放入 row 中並回覆 embed 和 row
        const buttonRow = new ActionRowBuilder()
            .addComponents(
                scissorButton, rockButton, paperButton
            );

        interaction.reply({ embeds: [buttonEmbed], components: [buttonRow] });

        //建立 collector
        const collector = interaction.channel.createMessageComponentCollector({ time: 15000 });

        let playerAChoice = -1, playerAId = 0, playerAName;
        let playerBChoice = -1, playerBId = 0;
        //等待 collector 蒐集到玩家案的按鈕
        collector.on('collect', async collected => {
            collected.reply({ content: "ok", ephemeral: true });

            //利用玩家所按按鈕的 customId 來判斷玩家的選擇
            let playerChoice;
            if (collected.customId === 'scissors') {
                playerChoice = 0;
            } else if (collected.customId === 'rock') {
                playerChoice = 1;
            } else if (collected.customId === 'paper') {
                playerChoice = 2;
            }
            if (playerAChoice == -1) {
                playerAChoice = playerChoice;
                playerAId = collected.user.id;
                playerAName = collected.user.username;
            } else if (playerBChoice == -1 && collected.user.id != playerAId) {
                playerBChoice = playerChoice;
                playerBId = collected.user.id;

                //判斷玩家勝利，電腦勝利或平手
                let gameState = 0;
                if (playerBChoice == 0) {
                    if (playerAChoice == 1) {
                        gameState = 2;
                    } else if (playerAChoice == 2) {
                        gameState = 1;
                    }
                } else if (playerBChoice == 1) {
                    if (playerAChoice == 0) {
                        gameState = 1;
                    } else if (playerAChoice == 2) {
                        gameState = 2;
                    }
                } else if (playerBChoice == 2) {
                    if (playerAChoice == 0) {
                        gameState = 2;
                    } else if (playerAChoice == 1) {
                        gameState = 1;
                    }
                }
                let winner;
                if (gameState == 2) {
                    winner = playerAName;
                } else if (gameState == 2) {
                    winner = collected.user.username;
                } else {
                    winner = "沒人";
                }
                const resultEmbed = new EmbedBuilder()
                    .setColor('#5865F2')
                    .setTitle('剪刀石頭布！')
                    .setDescription(`結果：${winner}獲勝！`);
                interaction.followUp({ embeds: [resultEmbed], components: [] });
                //關閉 collector
                collector.stop();

            }
        });
    }
};