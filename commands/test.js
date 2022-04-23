const { databaseString } = require('../config.json');
const Keyv = require('keyv');

const failVideos = new Keyv(databaseString, { namespace:`failvideos` });
failVideos.on('error', err => console.error('Keyv connection error:', err));


const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('echo')
		.setDescription('Replies with your input!')
		.addUserOption(option =>
			option.setName('name')
			.setDescription('The input to echo back!')
			.setRequired(true)
			)
		.addStringOption(option =>
			option.setName('url')
			.setDescription('another thing')
			.setRequired(true)
			)
		.addStringOption(option =>
			option.setName('description')
			.setDescription('another thing')
			.setRequired(true)
			)
		,
	async execute(interaction) {
		const name = interaction.options.getUser('name')
		const url = interaction.options.getString('url')
		const desc = interaction.options.getString('description')

		await interaction.reply({ content: (`${name} and ${url} and ${desc}`), ephemeral: false})

		// await failVideos.set(name.id, [{url, desc}])

		let vidList = await failVideos.get(name.id)
		if (!vidList) {
			vidList = []
		}
		
		vidList.push({url, desc})
		
		await failVideos.set(name.id, vidList)
		





		// KV would be => { 202145223944437760 : [URL, desc]}
		
		
		// TODO: Add sub-options (/fail add, /fail view, /fail [whatever term])
		// TODO: Validation check
		// TODO: If validation test passes, add to database

	},
};