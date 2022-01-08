const ms = require('ms')

var e = new Error('Could not parse input');
// e.message is 'Could not parse input'

module.exports = {
    name: 'message',
    run: async(client, message) => {
        if(message.author.bot || !message.guild ||!message.content.toLowerCase().startsWith("dot!")) return;
        const [cmd, ...args] = message.content.trim().slice("dot!".length).split(/ +/g);
        const command = client.commands.get(cmd.toLowerCase()) || client.commands.get(client.aliases.get(cmd.toLowerCase()));
        if(!command) return;
        if(client.cooldowns.has(`${message.author.id}-${command.name}`)) {
            return message.channel.send(`Try running this command in ${ms(client.cooldowns.get(`${message.author.id}-${command.name}`) - Date.now(), { long: true })}`)
        }
        try {
            await command.run(client, message, args)
            if(command.cooldown) {
                client.cooldowns.set(`${message.author.id}-${command.name}`, Date.now() + command.cooldown);
                setTimeout(() => {
                    client.cooldown.delete(`${message.author.id}-${command.name}`);
                }, command.cooldown);
            }
        } catch {
        }
    }
};