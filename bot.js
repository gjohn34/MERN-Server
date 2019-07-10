require('dotenv').config()
const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	// author = message.author
	console.log(message.author);
	message.channel.send(`@${message.author.username}#${message.author.discriminator} you are a fuck`)
  // if (message.content.match(/meme/i)) {
  //   message.channel.send('sick post my dude')
  // }
});

client.login(process.env.TOKEN);
