const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('teste')
		.setDescription('...'),
	async execute(interaction) {
		await interaction.reply(`teste...`);
	},
};