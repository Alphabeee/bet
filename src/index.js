const { REST, Client, Collection, Routes, GatewayIntentBits } = require("discord.js");
const { BOT_TOKEN, BOT_ID } = require("./Utility/config");
const Database = require("./Modules/Database");

const path = require("node:path");
const fs = require("node:fs");

const Bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

Bot.Commands = new Collection();
const Commands = [];
const COMMAND_PATH = path.join(__dirname, "Commands/");
const CommandFiles = fs.readdirSync(COMMAND_PATH).filter((file) => file.endsWith(".js"));
for (let i = 0; i < CommandFiles.length; i++){
    const FileName = CommandFiles[i];
    const Command = require(path.join(COMMAND_PATH, FileName));
    Bot.Commands.set(Command.data.name, Command);
    Commands.push(Command.data.toJSON());
}

const Rest = new REST({version: "10"}).setToken(BOT_TOKEN);
Rest.put(Routes.applicationCommands(BOT_ID), { body: Commands }).then((data) => {
    console.log(`Successfully registered ${data.length} commands!`)
}).catch(console.error);

Bot.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const Command = Bot.Commands.get(interaction.commandName);
    if (!Command) return;
    try{
        Command.execute(Bot, interaction);
    } catch(error){
        console.error(error);
    }
});

Bot.once("ready", () => {
    Database.init().then((Success) => {
        if (!Success){
            return process.exit(1);
        }
        console.log("Bot is ready!");
        return;
    });
});

Bot.login(BOT_TOKEN);
