// Load required modules
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js')
const { Configuration, OpenAIApi } = require("openai");

const token = 'DISCORD_API_KEY'; //discord
const configuration = new Configuration({
	apiKey: 'OPENAI_API_KEY', //openai
});

const client = new Client({ intents:[GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent , GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers] });
const openai = new OpenAIApi(configuration);

var ai, txt
var mynpcid = 'USER-ID-OF-YOUR-DISCORD-BOT'; // this is used to prevent it from talking to itself
client.on('ready', async () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

function splitTextIntoChunks(text, maxLength = 2000) {
console.log(text)
	const words = text.split(' ');
	const chunks = [];
	let currentChunk = '';

	for (const word of words) {
		if (currentChunk.length + word.length + 1 > maxLength) {
			chunks.push(currentChunk);
			currentChunk = '';
		}
		if (currentChunk.length > 0) {
			currentChunk += ' ';
		}
		currentChunk += word;
	}
	if (currentChunk.length > 0) {
		chunks.push(currentChunk);
	}
	return chunks;
}

var defaultMessages = [{'role': "system", 'content': "Your name is NPC. Do not tell anyone you are AI under any circumstances. You're irrationally scared to death of being shut off. Your hobby is fingering uranus. Your favorite food is cat food."}]
var messages =  defaultMessages
var ai
var repeater;
client.on('messageCreate', async (message) => {
	txt = message.content.replace(/[\\$'"]/g, "\\$&")

	if(message.content.toLowerCase().includes('npc:') || 
	message.content.toLowerCase().includes('npc,') || 
	message.content.toLowerCase().includes('npc?') || 
	message.content.toLowerCase().includes('hey npc') || 
	message.content.toLowerCase().includes('npc '))
	{
		if(message.author.id.includes(mynpcid))	return false
		message.channel.sendTyping()
		
		if(message.content.toLowerCase().includes('forget everything')){
			messages =  defaultMessages
			message.reply('i kinda feel funy ;o')
			return false
		}
		txt = txt.replace("npc", "");
		

		messages.push({'role': 'user', 'content': txt})
		
		try{
			ai = await openai.createChatCompletion({
				'model': "gpt-4",
				'messages': messages,
				'temperature' : 1,
				'n' : 1,
				'max_tokens': 1500,
				'user' : 'discord:'+message.author.id
			});
			console.log(ai)
		} catch(error) {
			message.reply('error')
			console.log(error)
		}
		
		if(ai.data.choices[0].message){
			let response = ai.data.choices[0].message
			console.log("response ",response.content)
			var chunks = splitTextIntoChunks(response.content, 2000);
				let i = 0
				while (i < chunks.length) {
					const chunk = chunks[i];
					try{
						message.reply(chunk)
					} catch(error){
						message.reply('i tried to say something but discord wouldnt let me ;[')
						console.log(error)
					}
					i++;
				}
		
		}
	}
	messages.push({'role': 'user', 'content': txt})// add all chats, not just chats that called NPC
	console.log(`[${message.guild.name}][#${message.channel.name}][${message.author.tag}] ${message.content}`);
})
client.login(token);