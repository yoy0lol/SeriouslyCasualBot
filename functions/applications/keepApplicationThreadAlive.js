const { applicationsViewerChannelId, databaseString } = require('../../config.json');
const Keyv = require('keyv');

const openApplications = new Keyv(databaseString);
openApplications.on('error', err => console.error('Keyv connection error:', err));

const adminRoleId = '255630010088423425';

async function keepApplicationThreadAlive(applicationChannel, threadId) {
	console.log(`${new Date().toLocaleString()}: Keeping application thread alive for ${applicationChannel.name}...`);

	applicationChannel.guild.channels
		.fetch(applicationsViewerChannelId)
		.then(applicationViewerChannel => {
			applicationViewerChannel.threads
				.fetch(threadId)
				.then(async thread => {
					if (thread) {
						console.log(`${new Date().toLocaleString()}: Thread ${thread.name} found...`);
						if (thread.archived) {
							console.log(`${new Date().toLocaleString()}: Thread ${thread.name} is archived, sending message to keep alive`);

							await thread.send(`<@&${adminRoleId}> Application still open - Keeping thread alive`);
						}
						else {
							console.log(`${new Date().toLocaleString()}: Thread ${thread.name} is active, skipping`);
						}
					}
					else {
						console.log(`${new Date().toLocaleString()}: Thread not found, stopping...`);
					}
				})
				.catch(console.error);
		})
		.catch(console.error);
}

exports.keepApplicationThreadAlive = keepApplicationThreadAlive;