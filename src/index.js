const { Client, GatewayIntentBits } = require("discord.js")
const { Configuration, OpeanAIApi, OpenAIApi } = require("openai")
const { Exceptions } = require("./exceptions")
const fs = require("fs")


class Bot {
    /**
     * Client manager for OPENAI and Discord API combined
     * @param {Object} opts Options for gpt bot
     * @param {String?} [opts.DISCORD_API_KEY=process.env.DISCORD_API_KEY] Discord api key
     * @param {String?} [opts.DISCORD_CLIENT_ID=process.env.DISCORD_CLIENT_ID] Discord client id, found in dev portal (Not the user id)
     * @param {String?} [opts.OPENAI_API_KEY=process.env.OPENAI_API_KEY] Open ai API key
     * @param {String?} [opts.MODEL=process.env.MODEL] Open ai model
     * @param {Array<String>} opts.messages Open-ai spec messages, ex: [{'role': "system", 'content': "Training Prompt Content"}]
     */
    constructor(opts) {

        this.client = new Client({ 
            intents: [
                GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers
            ]
        })

        this.commands = {}
        
        this._opts = {
            apiKey: process.env.OPENAI_API_KEY,
            DISCORD_API_KEY: process.env.DISCORD_API_KEY,
            MODEL: process.env.MODEL,
            ...opts
        }

        if (!this._opts.apiKey) {
            throw Exceptions.MISSING_OPTION_EXCEPTION("OPENAI_API_KEY")
        } else if (!this._opts.DISCORD_API_KEY) {
            throw Exceptions.MISSING_OPTION_EXCEPTION("DISCORD_API_KEY")
        } else if (!this._opts.MODEL) {
            throw Exceptions.MISSING_OPTION_EXCEPTION("MODEL")
        }

        /**
         * @type {OpenAIApi}
         */
        this.openai = new OpeanAIApi(new Configuration({
            apiKey: apiKey
        }))

        this.messages = [...this.messages]
    }

    login() {
        return this.client.login()
    }

    get on() {
        return this.client.on
    }

    /**
     * 
     * @param {Object} opts Options for Register Commands
     * @param {String?} [opts.path='./commands'] Commands Folder Path
     * @param {(interaction: import("discord.js").Interaction) => void} opts.interactionCallback callback for the interaction
     */
    async registerCommands(opts) {
        let _opts = {
            path: "./commands",
            ...opts
        }

        let paths = fs.readdirSync(path)

        for (let file of paths) {
            let command = new (require(file).default)()
            try {
                if (!command.data) {
                    throw Exceptions.MISSING_DATA_EXCEPTION
                } else if (!command.command) {
                    throw Exceptions.MISSING_COMMAND_EXCEPTION
                }
                await this.client.application.commands.create(command.data.toJson())
                this.commands[command.data.name] = command
            } catch (error) {
                console.error(error)
            }
            
        }

        this.on("interactionCreate", interaction => {
            if (interaction.isCommand()) {
                return
            }
            let command = commands[interaction.commandName]
            if (!command) {
                return interaction.reply("Command Not Found")
            } 
            
            command.command(this, interaction)
            if (_opts.interactionCallback) {
                _opts.interactionCallback(interaction)
            }
        })
        
    }
}

module.exports = {
    Bot
}