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

const messages = ["Bottom", "Top",]
const randomMessage = messages[Math.floor(Math.random() * messages.length)];


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
// top or bottom
    if (command === 'toporbot') {
         const toporbot = [
            'You are a **Top**',
            'You are a **Bottom**',
            'You might just be a **Bottom**',
            'You might just be a **Top**',
            'You act like a **Top**, but we all know you are a **Bottom**',
            'You act like a **Bottom**, but we all know you are a **Top**',
            'You probably like to switch it around ;)',
    ];
        const response = toporbot[Math.floor(Math.random() * toporbot.length)];
         msg.reply(response);
    }
// member count
    if (command === 'members') {
        msg.reply(`There are ${msg.guild.memberCount} members in this server`)
    }
// invite
    if (command === 'invite') {
        msg.reply(`https://discord.gg/X2s6Uv8Pgc`)
    }
// garfeld
    if (command === 'garfield') {
    msg.reply(`https://images-ext-1.discordapp.net/external/DtxjJdge_Cxj2keMcsNM1hfI9Zh2MMtbwEaUNf9Ewzw/https/i.imgur.com/XJw9aAv.mp4`)
}
// ya like jazz?
    if (command === 'yalikejazz?') {
    msg.reply(`https://c.tenor.com/mPe_dMpYInoAAAAC/tucoemuitolegal-bee-movie.gif`)
}
// yapein
    if (command === 'yapein') {
    msg.reply(`https://images-ext-2.discordapp.net/external/Y05HYXaBSeJeIEbN-6HsB0kdj6k__5QKRn_TJRxHp8U/%3Fsize%3D128/https/cdn.discordapp.com/emojis/925538276989886484.gif`)
}
// poll command
    if (command === 'poll') {
        let message = await msg.reply(args.join(' '));
        await message.react('✅');
        await message.react('❌');
    }
// help (doesnt work lol)
    if (command === 'help') {
    const embed = new Discord.MessageEmbed()
        .setTitle('Help')
        .setColor('#FF33AC')
        .setDescription('Available commands:')
        .setTimestamp()
    msg.reply({embeds: [embed]});    
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
    client.user.setActivity(`dot!`);
  });