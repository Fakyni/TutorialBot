let Discord = require('discord.js');
let fs = require('fs');

let bot = new Discord.Client();
console.log('Booting!');

let file = JSON.parse(fs.readFileSync('./bot.json'));
bot.login(file.token);

bot.on('ready', () => {
    console.log('online!');
});

bot.on('message', message => {
    let cmd = message.content.toLowerCase();
    if(cmd === "!ping"){
        message.channel.send('pong!');
    } else if(cmd === "!hello"){
        message.channel.send('sup my dude.');
    }
});
