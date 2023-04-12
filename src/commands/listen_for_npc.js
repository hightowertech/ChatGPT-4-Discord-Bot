const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const { splitTextIntoChunks } = require("../utils")
/**
 * Note to developer:
 * I may be wrong about this, but I am 90% sure if you use
 * all messages in the gpt prompt, it will take tokens for each of the messages for each generation. To save yourself money, it would be better to not save state for all purposes.
 * Messages should be filtered, and you may possibly want to opt users into it so it doesnt use useless tokens that take away from the gpts prompt generation power.
 * If you do decide to implement chat states with multiple methods (This is not a bad idea, just needs good implementation), you should have it cache itself so its only using
 * the current conversations (last 10-20 messages) for the prompt. As a matter of fact, you would not even need to cache messages, as you can use the discord
 * library to get the messages before the interaction fires. Best of luck and if you are interested in that functionality i can add it as i was planning on writing one of these
 * bots for my own usages. 
 */
module.exports.default = class Npc_Listener {
    /**
     * This command returns a embed view with buttons, for next and previous parts of the message, which breaks up the messages into 2000 character segments (however i believe embeds can take more)
     */
    constructor() {
        this.system_messages = [{
            role: "system",
            message: "You are an assistant similar to google, siri, or alexa, try your best to answer the users questions, provide links and sources to topics where applicable. Take it step by step and help solve the users issue."
        }] 

        /**
         * This declares whether or not the command can only be used by developers.
         * @type {Boolean}
         */
        this.developer = true
    }

    get data() {
        return new SlashCommandBuilder()
            .setName("hey_npc")
            .setDescription("Speak to GPT in an okay google like fashion, messages are not-persistant")
            .addStringOption("prompt")
        
    }

    /**
     * 
     * @param {import("../index").Bot} bot 
     * @param {import("discord.js").Interaction} interaction 
     */
    async command(bot, interaction) {
        let messageFromOpenAI = bot.openai.createChatCompletion({
            model: bot._opts.MODEL,
            messages: [{
                role: "user",
                content: interaction.options.prompt,
            }, ...this.system_messages],
            temperature: .50, //Set down from 1 because it will use up more tokens if its higher, as well as make less concentrated responses
            n: 1, //Keeping at 1, only one response is needed.
            max_tokens: 1500 // Leaving at 1500, seems legit.
        })

        try {
            let chunks = splitTextIntoChunks(await messageFromOpenAI)
            let description = chunks[0]
            let embed = new MessageEmbed()
            .setTitle("ChatGPT Message")
            .setDescription(description)

            let row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId(`${interaction.id}-prev`)
                        .setLabel("Prev")
                        .setStyle("PRIMARY"),
                    new MessageButton()
                        .setCustomId(`${interaction.id}-next`)
                        .setLabel("Next")
                        .setStyle("PRIMARY")
                )
            
            let sent_message = await interaction.channel.send({
                embeds: [embed],
                components: [row]
            })

            const collector = sent_message.createMessageComponentCollector({
                filter: newInteraction => {
                    if ((newInteraction.customId == `${interaction.id}-next` || newInteraction.customId == `${interaction.id}-prev`) && newInteraction.user.id == interaction.user.id) {
                        return true
                    } else return false
                }
            })

            collector.on("collect", newInteraction => {
                newInteraction.deferUpdate()
                let index = chunks.indexOf(description)
                let newEmbed = new MessageEmbed()
                    .setTitle(`ChatGPT Message pg.${index}`)

                if (newInteraction.customId == `${interaction.id}-next`) {
                    if ((index + 1) > chunks.length) {
                        description = chunks[0]
                    } else {
                        description = chunks[index + 1]
                    }
                    sent_message.edit({ embeds: [newEmbed], components: [row] })
                } else if (newInteraction.customId == `${interaction.id}-prev`) {
                    if ((index - 1) < 0) {
                        description = chunks[chunks.length - 1]
                    } else {
                        description = chunks[index - 1]
                    }
                }

                newEmbed.setDescription(description)
                sent_message.edit({
                    embeds: [embed],
                    components: [row]
                })
            })
        } catch (error) {
            console.error(error)
            interaction.reply("Something happened on openai's server...")
        }

    }
}