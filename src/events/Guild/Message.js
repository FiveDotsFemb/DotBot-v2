module.exports = {
    name: 'message',
    run: async(client, message) => {
        if(message.author.bot || !message.guild ||!message.content.toLowerCase().startsWith("dot!")) return;
        const [cmd, ...args] = message.content.trim().slice("dot!".length).split(/ +/g);
        const command = client.commands.get(cmd.toLowerCase());
        if(!command) return;
        try {
            await command.run(client, message, args)
        } catch {
            return message.channel.send(`An error occurred: \`${e.message}\``);
        }
    }
};