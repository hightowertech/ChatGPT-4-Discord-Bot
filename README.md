# ChatGPT 4 Discord Bot
 ChatGPT4 Discord Bot running on nodejs using discord.js

This bot works using OpenAI's api and Discord.js to make a simple discord bot. You will need a discord token and openai token to make it work.

This is currently configured to run using the invite-only GPT4 model but can be modified to run gpt-3.5-turbo by just chaning the model from
```'model': "gpt-4"``` to ```'model': "gpt-3.5-turbo"```

The Chatbot's name is NPC and once its in your server you can prompt it by saying "npc, write a story about cat aliens". (theres some extra delay on the gpt4 model)

Docs for the chat completion api from openai
https://platform.openai.com/docs/guides/chat

You will need to make a discord application with Bot -> Send/Read messages+channels to allow the bot to see messages.
https://discord.com/developers/applications

OAuth2 settings for the bot. Set these settings, scroll down and Discord generates a link that can be used to add your bot to discord.
<img src="https://i.imgur.com/eBjVO4m.png">


<b>very friendly suggestion: If you make this bot a public bot, it can be added by anyone. Make sure to review your settings in ChatGPT and set a spending limit if you make a public discord bot.</b>
