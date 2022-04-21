const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('echo')
		.setDescription('Replies with your input!')
		.addStringOption(option =>
			option.setName('text')
			.setDescription('The input to echo back!')
			.setRequired(true)
			)
		.addStringOption(option =>
			option.setName('text2')
			.setDescription('another thing')
			.setRequired(true)
			)
		,
	async execute(interaction) {
		const input1 = interaction.options.getString('text')
		const input2 = interaction.options.getString('text2')
		await interaction.reply(`${input1} and ${input2}`);
	},
};