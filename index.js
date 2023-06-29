const { REST, EmbedBuilder, Collection, Routes } = require("discord.js");
const { Client, GatewayIntentBits, Discord } = require("discord.js");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.commands = new Collection();
const commands = [];
const commandFiles = fs.readdirSync("./src/Commands").filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(`./src/Commands/${file}`);
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
rest.put(Routes.applicationCommands(process.env.BOTID), { body: commands })
    .then((data) => console.log(`Successfully registered ${data.length} application commands.`))
    .catch(console.error);
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        command.execute(client, interaction);
    } catch (error) {
        console.error(error);
    }
});

client.once("ready", () => {
    console.log("Ready!");
});

client.login(process.env.TOKEN);
