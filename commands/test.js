const { databaseString } = require('../config.json');
const Keyv = require('keyv');

const failVideos = new Keyv(databaseString, { namespace:`failvideos` });
failVideos.on('error', err => console.error('Keyv connection error:', err));

const { SlashCommandBuilder } = require('@discordjs/builders');
const { DiscordAPIError } = require('discord.js');

function pushToList(list, ob){
	return list.push(ob)
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fail')
		.setDescription('View or add a fail video.')
		.addSubcommand(subcommand =>
				subcommand
					.setName('add')
					.setDescription('Add a fail video to the library')
					.addUserOption(option =>
						option.setName('name')
						.setDescription('The discord user tag of the player')
						.setRequired(true)
						)	
					.addStringOption(option =>
						option.setName('url')
						.setDescription('The URL of the video (this bot only accepts Twitch, YouTube or Squad Videos')
						.setRequired(true)
						)
					.addStringOption(option =>
						option.setName('description')
						.setDescription('The description of the fail')
						.setRequired(true)
						))
		.addSubcommand(subcommand =>
				subcommand
					.setName('view')
					.setDescription("View a player's fails")
					.addUserOption(option =>
						option.setName('name')
						.setDescription('The discord user tag of the player')
						.setRequired(true))
					)
		,
	

	


	async execute(interaction) {
		if (interaction.options.getSubcommand() === 'add') {
			console.log (`this is the ADD subcommand`)
		}
		if (interaction.options.getSubcommand() === 'view') {
			console.log (`this is the VIEW subcommand`)
		}

		// const name = interaction.options.getUser('name')
		// const failUrl = interaction.options.getString('url')
		// const desc = interaction.options.getString('description')

		// // regex check for link
		// const urlSourceRegexTest = /twitch|youtube|squad/
		// const urlCheckTest = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
		// const linkValid = urlSourceRegexTest.test(failUrl) && urlCheckTest.test(failUrl)
		// console.log(linkValid)
		
		// // if the regex validation passes, continue with the code, else alert the user that this is invalid:
		// if (linkValid) {
		// 	// set a variable that can change
		// 	let id = 1
		// 	let vidList = await failVideos.get(name.id)
			
		// 	// if it doesnt exist, create an empty list
		// 	if (!vidList) {
		// 		vidList = []
		// 		pushToList(vidList, {id, failUrl, desc})
		// 	} else {
		// 		id = vidList[vidList.length - 1].id + 1
		// 		pushToList(vidList, {id, failUrl, desc})
		// 	}
			
		// 	await failVideos.set(name.id, vidList)
			
		// 	const addedVideoReply = `
		// 	Your video has been added!\n\nHere's a fail video of ${name} with this description:\n${desc}\n\n${failUrl}`
			
		// 	await interaction.reply({
		// 		content: addedVideoReply,
		// 		ephemeral: false,
		// 	})
		// } else {
		// 	await interaction.reply({
		// 		content: '⚠️ERROR⚠️\nThis is not a valid link!\n\nMake sure the following conditions are met:\n1. The link is from YouTube, Twitch or Squad.OV\n2. The link is a valid URL.',
		// 		ephemeral: true
		// 	})
		// }



		



		// TODO: find a way to assign an id to each entry (1, 2, 3...) ✅
		// TODO: Add a validation check to the URL ✅
		// TODO: Find a way to react to a specific subcommand
		// TODO: add a sub option (to list the videos 'Yoyo's fail videos are..)
	},
};