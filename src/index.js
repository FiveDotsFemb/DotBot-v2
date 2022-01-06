const Discord = require("discord.js");
const { Client, Intents, Collection } = require('discord.js');
const { promisify } = require( 'util' );
const glob = require('glob');
const globPromise = promisify(glob);
const config = require('../config.json');

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

const PREFIX = "dot!";
const generateImage = require("./generateImage");

// prefix
client.on('messageCreate', async (msg) => {
    if (!msg.content.startsWith(PREFIX)) return;

    const args = msg.content.slice(PREFIX.length).split(/ +/);
    const command = args.shift().toLowerCase();
// avatar
    if (command === 'avatar') {
        const embed = new Discord.MessageEmbed()
            .setTitle('User Avatar')
            .setColor('#FF33AC')
            .setImage(msg.author.avatarURL())
            .setTimestamp()
        msg.reply({embeds: [embed]});    
    }
// member count
    if (command === 'members') {
        msg.reply(`There are ${msg.guild.memberCount} members in this server`)
    }
// invite
    if (command === 'invite') {
        msg.reply(`https://discord.gg/X2s6Uv8Pgc`)
    }
// poll command
    if (command === 'poll') {
        let message = await msg.reply(args.join(' '));
        await message.react('✅');
        await message.react('❌');
    }
})

const welcomeChannelId = (config.CHANNEL)

client.on("guildMemberAdd", async (member) => {
    const img = await generateImage(member)
    member.guild.channels.cache.get(welcomeChannelId).send({
        content: `<@${member.id}> Welcome to the server!`,
        files: [img]
    })
})

client.login(config.token)

client.on("ready", () => {
    console.log(`Bot: Hosting ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
    client.user.setActivity(`Drain GANGG`);
  });