// Load required modules
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js')
const { Configuration, OpenAIApi } = require("openai");

const token = 'put your discord token here'; //discord
const configuration = new Configuration({
	apiKey: 'putyourapikeyhere for openai', //openai
});
const client = new Client({ intents:[GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent , GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers] });
const openai = new OpenAIApi(configuration);

var history, mainChannel, testChannel, ai, txt
var historyLen = 2000

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


var messages =  [{'role': "user", 'content': "hello"}]
var ai
var repeater;
client.on('messageCreate', async (message) => {
	if(message.author.id.includes('some super special string here guys') && !message.content.toLowerCase().includes('npc, ')){
		return false
	}
	txt = message.content.replace(/[\\$'"]/g, "\\$&")

	if(message.content.toLowerCase().includes('npc:') || 
	message.content.toLowerCase().includes('npc,') || 
	message.content.toLowerCase().includes('npc?') || 
	message.content.toLowerCase().includes('hey npc') || 
	message.content.toLowerCase().includes('npc '))
	{
		message.channel.sendTyping()
		if(message.author.tag.includes('real npc#5859')) {return false;} //bots name

		if(message.content.toLowerCase().includes('forget everything')){
			messages =  [{'role': "user", 'content': "hi"}]
			message.reply('i kinda feel funy ;o')
			return false
		}

		if(message.author.id.includes('436084153503711232')){
			console.log('self')
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
			'user' : message.author.id
			});
			console.log(ai)
		} catch(error) {
			message.reply('error')
			console.log(error)
			console.log(error.response.status);
			console.log(error.response.data);
			console.log(error.message);
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
				//console.log(ai)
				//console.log(ai.data.choices[0].message)

		
		}
	}
	messages.push({'role': 'user', 'content': txt})
	
	console.log(`[${message.guild.name}][#${message.channel.name}][${message.author.tag}] ${message.content}`);
})

client.login(token);