const { databaseString } = require('../config.json');
const Keyv = require('keyv');
const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { DiscordAPIError } = require('discord.js');
const failVideos = new Keyv(databaseString, { namespace:`failvideos` });
failVideos.on('error', err => console.error('Keyv connection error:', err));

// FUNCTIONS

function pushToList(list, ob){
	return list.push(ob)
}

function urlValidationChecker(link){
	const urlSourceRegexTest = /twitch|youtube|squad/
	const urlCheckTest = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
	return urlSourceRegexTest.test(link) && urlCheckTest.test(link)	
}

function urlDuplicationChecker(vidList, link){
	const result = vidList.filter((e) => e.failUrl === link)
	console.log(result.length === 0)
	return result.length === 0
}

// CODE

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
					.setName('list')
					.setDescription("List a player's fails")
					.addUserOption(option =>
						option.setName('name')
						.setDescription('The discord user tag of the player')
						.setRequired(true))
					)
		.addSubcommand(subcommand =>
				subcommand
					.setName('view')
					.setDescription("View a player's fail video")
					.addUserOption(option =>
						option.setName('name')
						.setDescription('The discord user tag of the player')
						.setRequired(true))
					.addNumberOption(option =>
						option.setName('id')
						.setDescription("The ID of the player's fail video")
						.setRequired(true))
					)
		,
	
	async execute(interaction) {
		const name = interaction.options.getUser('name')
		const failUrl = interaction.options.getString('url')
		const desc = interaction.options.getString('description')
		let vidList = await failVideos.get(name.id)

		// CODE FOR SUBCOMMAND: ADD

		if (interaction.options.getSubcommand() === 'add') {
			// regex check for link
			const linkValid = urlValidationChecker(failUrl)
			const duplicationCheck = urlDuplicationChecker(vidList, failUrl)

			// TODO: desc character limit?
			// TODO: if the same URL is there, decline?
			
			// if the regex validation passes, continue with the code, else alert the user that this is invalid:
			if (linkValid && duplicationCheck) {
				// set a variable that can change
				let id = 1
				
				// if it doesnt exist, create an empty list
				if (!vidList) {
					vidList = []
					pushToList(vidList, {id, failUrl, desc})
				} else {
					id = vidList[vidList.length - 1].id + 1
					pushToList(vidList, {id, failUrl, desc})
				}
				
				await failVideos.set(name.id, vidList)
				
				const addedVideoReply = `
				Your video has been added!\n\nHere's a fail video of ${name} with this description:\n${desc}\n\n${failUrl}`
				
				await interaction.reply({
					content: addedVideoReply,
					ephemeral: false,
				})
			} else {
				await interaction.reply({
					content: '⚠️ERROR⚠️\nThis is not a valid link!\n\nMake sure the following conditions are met:\n1. The link is from YouTube, Twitch or Squad.OV\n2. The link is a valid URL.',
					ephemeral: true
				})
			}
		}
		
		// CODE FOR SUBCOMMAND: LIST
		
		if (interaction.options.getSubcommand() === 'list') {
			if (vidList) {
				let idFieldValues = ''
				let vidFieldValues = ''
				vidList
				.reverse()
				.forEach(vidEntry => {
					console.log(vidEntry.id, vidEntry.failUrl, vidEntry.desc)
					idFieldValues += `${vidEntry.id}\n\n`
					vidFieldValues += `${vidEntry.desc}\n\n`
				});
				console.log(name)

				const failVideoListEmbed = new MessageEmbed()
				.setTitle(`${name.username}'s Fail Video List`)
				.addFields(
					{name: 'ID', value: idFieldValues, inline: true},
					{name: 'Description', value: vidFieldValues, inline: true}
				)

				await interaction.reply({
					content: `Here are ${name}'s fail videos. To get the link for them, use the following command: /fail view ${name} [ID number]`, // FIXME: make sure the command is the same
					embeds: [failVideoListEmbed]
				})

			} else {
				await interaction.reply({
					content: `${name} doesn't have any fail videos. :(`,
					ephemeral: true
				})
			}
		}

		// CODE FOR SUBCOMMAND: VIEW
		if (interaction.options.getSubcommand() === 'view') {
			const filterId = interaction.options.getNumber('id')
			if (vidList) {
				const result = vidList.filter((e) => e.id === filterId)[0]
				console.log(result)
				await interaction.reply({
					content: `Here is ${name}'s fail video: ${result.failUrl}` //FIXME: Put a check in place so that when a user's input is invalid (i.e. when they put an ID that's not there, return an error message)
				})
			}
		}

	},
};