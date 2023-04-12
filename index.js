const { Bot } = require("./src")

// Commands can be made in the commands folder, you may refer to listen_for_npc.js for reference on how they should be structured.

/**
 * Todo:
 * - Unit tests with jest
 * - Add conversation manager
 * - Create universal paginator for responses
 */

/**
 * If you put values in the .env file, no one will beable to see them on github because of the gitignore, and the bot will automatically derive variables
 */
const bot = new Bot({
    DISCORD_API_KEY: "",
    DISCORD_CLIENT_ID: "",
    OPENAI_API_KEY: "",
    MODEL: "gpt-4",
    messages: [{
        role: "system",
        content: "You are a discord ai assistant. Think over the following prompts, take it step by step."
    }]
})

async function run() {
    await bot.login()
    await bot.registerCommands({
        path: "./commands",
        interactionCallback: interaction => {
            console.log(`Command ran by: ${interaction.user.username}:${interaction.commandName}`)
        }
    })
}

run()