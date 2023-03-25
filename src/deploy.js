const { REST,Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const env = process.env;

const commands = [];
const commandsPath = path.join(__dirname,'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(env.BOT_TOKEN);

(async () => {
  try {
    console.log(`Iniciada a atualização dos comandos do aplicativo ${commands.length} (/).`);

    const data = await rest.put(
      Routes.applicationGuildCommands(env.CLIENT_ID,env.GUILD_ID),
      { body: commands },
    );

    console.log(`Comandos de aplicativo (/) ${data.length} recarregados com sucesso.`);
  } catch (error) {
    console.error(error);
  }
})();