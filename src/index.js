const Discord = require("discord.js");
const { Client, Intents, Collection } = require('discord.js');
const { promisify } = require( 'util' );
const glob = require('glob');
const config = require('../config.json');

const globPromise = promisify(glob);

const client = new Discord.Client({
    intents: [
        "GUILDS",
        "GUILD_MESSAGES",
        "GUILD_MEMBERS",
        "GUILD_BANS",
    ]
});

client.commands = new Collection();
client.events = new Collection();
client.cooldowns = new Collection();
client.aliases = new Collection();

;(async() => {
    const eventFiles = await globPromise(`${__dirname}/events/**/*.js`);
    const commandFiles = await globPromise(`${__dirname}/commands/**/*.js`);

    eventFiles.map((value) => {
        const file = require(value);
        client.events.set(file.name, file);
        client.on(file.name, file.run.bind(null, client));
    });
    commandFiles.map((value) => {
        const file = require(value);
        client.commands.set(file.name, file);
        if(file.aliases) {
            file.aliases.map((value) => client.aliases.set(value, file.name));
        };
    });

})();

client.login(config.token);