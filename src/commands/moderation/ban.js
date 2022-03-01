module.exports = {
    name: 'ban',
    category: 'moderation',
    run: async(client, message, args) => {
        // no perms
        if(!message.member.permissions.has('BAN_MEMBERS')) return message.channel.send("You don't have permissions for this!");
        if(!message.guild.me.permissions.has('BAN_MEMBERS')) return message.channel.send("I don't have permissions for this!");
        // can't find user
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!user) return message.channel.send("I couldn't find that user!");
        // reason
        const reason = args.slice(1).join(" ") || "No reason provided.";
        // hierarchy
        if((message.member.roles.highest.position <= user.roles.highest.position) && message.guild.ownerID != message.author.id) return message.channel.send("You can't ban them due to hierarchy.");
        if(message.guild.me.roles.highest.position <= user.roles.highest.position) return message.channel.send("I can't ban them due to hierarchy.");
        try {
            await message.guild.members.ban(user.id, { reason });
            return message.channel.send("Banned.");    
        } catch {
            return message.channel.send("There was an error.");
        }
    }
}
