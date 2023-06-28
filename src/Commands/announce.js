process.noDeprecation = true;
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("announce")
        .setDescription("Sends an announcement to the designated channel")
        .addChannelOption((option) =>
            option.setName("channel").setDescription("The channel to send the announcement to").setRequired(true),
        )
        .addStringOption((option) =>
            option.setName("message").setDescription("The message to send").setRequired(true),
        )
        .addAttachmentOption((option) =>
            option.setName("front-attachment").setDescription("Attachment to include before the message").setRequired(false),
        )
        .addAttachmentOption((option) =>
            option.setName("rear-attachment").setDescription("Attachment to include after the message").setRequired(false),
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(bot, interaction){
        const Channel = interaction.options.getChannel("channel");
        const Message = interaction.options.getString("message");
        const FrontAttachment = interaction.options.getAttachment("front-attachment");
        const RearAttachment = interaction.options.getAttachment("rear-attachment")
        const ToEdit = interaction.reply({
            content: "Give me a moment...",
        });
        await Channel.send({
            files: [FrontAttachment.attachment],
        });
        await Channel.send(Message);
        await Channel.send({
            files: [RearAttachment.attachment],
        });
        interaction.editReply(`Message successfully sent to ${Channel}`);
        return;
    }
}