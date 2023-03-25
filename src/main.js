require('dotenv/config');
const { Client,Collection,REST,Routes } = require("discord.js");
const path = require("node:path")
const fs = require("node:fs")

const env = process.env;

const client = new Client({
  intents: [
    'GuildMessages',
    'GuildMembers',
    'DirectMessages',
    'Guilds'
  ]
});

client.commands = new Collection();

const commands = [];
const commandsPath = path.join(__dirname,'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath,file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name,command);
  } else {
    console.log(`[WARNING] O comando em ${filePath} não possui uma propriedade "data" ou "execute" obrigatória.`);
  }
}

client.once('ready',(client) => {
  console.log(`${client.user.username} está online`)
});

client.on('interactionCreate',async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`Nenhum comando correspondente ${interaction.commandName} foi encontrado.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'Ocorreu um erro ao executar este comando!',ephemeral: true });
    } else {
      await interaction.reply({ content: 'Ocorreu um erro ao executar este comando!',ephemeral: true });
    }
  }
});

require('./deploy')

client.login(env.BOT_TOKEN)