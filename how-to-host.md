# How to Host Discord-Radio

## Download the Latest Build

1. On the [main page](https://github.com/Daanisaanwezig/Discord-Radio) of the repository, click on the **Releases** header in the right column.
2. Open the **Assets** dropdown of the latest release, download the source code, and extract it.

## Install Node.js

1. Download and install Node.js from [here](https://nodejs.org/en/); Discord-Radio requires version 16.9.1 or later.
2. Open your command line in the folder with the source code and use the following command to install all required dependencies.

```bash
npm install
```

## Create a Discord Application

1. Head to the [Discord Developer Portal](https://discord.com/developers/applications) click *New Application* in the top-right corner.
2. After giving your application a name, navigate to the **Bot** page and click *Add Bot*.
3. If you do not want the bot to be able to be added by anyone, toggle off the *Public Bot* setting.
4. Toggle on the *Presence Intent* and *Server Members Intent* settings.
5. Navigate to the **OAuth2** page and check the *bot* and *applications.commands* scopes.
6. Scroll down and grant the bot the *View Channels* permission, as well as all the permissions under the *Text Permissions* and *Voice Permissions* columns.
7. Above, under *Scopes*, copy the URL and paste it into your browser.
8. Invite the bot to the desired server. Note that you must have the *Manage Server* permission in the desired server to do so.

## Add Environment Variables

1. Open the `botconfig.json` file in the source code folder.
2. Replace the value of `CLIENT_ID` with the *Client ID* of the bot, found on the **OAuth2** page of the application in the [Discord Developer Portal](https://discord.com/developers/applications).
3. Replace the value of `GUILD_ID` with the ID of the server the bot has been added to. This can be done by right-clicking on the server name in the top-left corner and clicking *Copy ID*. If *Copy ID* does not appear, head to **User Settings** and toggle on *Developer Mode*.
4. Replace the value of `BOT_TOKEN` with the *Token* of the bot, found on the **Bot** page of the application in the [Discord Developer Portal](https://discord.com/developers/applications). Keep in mind that the bot token is a sensitive piece of information that should never be shared with others.
5. Save and close the `botconfig.json` file.

## Start Up the Bot

1. Open your command line in the folder with the source code and use the following command to deploy the bot's commands.

```bash
node deploy-commands.ts
```

2. Run the following command to start up the bot.

```bash
npm start
```

---

**Congratulations! Your bot should appear Online in your server and is ready for use!**
