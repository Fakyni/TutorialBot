let Discord = require('discord.js');
let fs = require('fs');

global.bot = new Discord.Client();
console.log('Booting!');

global.file = JSON.parse(fs.readFileSync('./bot.json'));
bot.login(file.token);

console.log('Loading commands!');
global.commands = {};
fs.readdir('./commands', (err, data) => {
  if(err){
    console.log(err.stack);
    return;
  }
  let files = String(data).split(',');
  for(let i = 0; i < files.length; i++){
    try {
      require('./commands/' + files[i]);
    } catch(error) {
      console.log('Error loading command ' + files[i] + '\n' + error.stack);
    }
  }
});

global.Command = function(tbl){
  if(!tbl) throw new Error("Command: Table expected, got " + typeof tbl);
  if(typeof tbl.call !== "string") throw new Error("Command: call should be a string, got " + typeof tbl.call);

  this.title = (typeof tbl.title === "string") ? tbl.title : "Undefined";
  this.id = (typeof tbl.id === "string") ? tbl.id : this.title.toLowerCase().replace(/ /g, '_');
  this.description = (typeof tbl.description === "string") ? tbl.description : "No description.";
  this.call = tbl.call;
  this.onCall = (typeof tbl.onCall === "function") ? tbl.onCall :
  function(message){
    message.channel.send('Command ran!').catch(console.log);
  };

  commands[this.id] = this;
  console.log(`Registered command: ${this.title}`);
}

bot.on('ready', () => {
  console.log('Online!');
});

global.parseArgs = function(str){
  let out = [];
  let quote = false;
  let tempstr = '';
  for(let i = 0; i < str.length; i++){
    if(str[i] === " " && !quote && tempstr.trim().length > 0){
      out.push(tempstr.trim());
      tempstr = '';
    } else if(str[i] === '"' && str[i - 1] !== "\\"){
      quote = !quote;
    } else {
      if(str[i] === "\\" && str[i + 1] === '"') continue;
      tempstr += str[i];
    }
  }

  if(tempstr.trim().length > 0){
    out.push(tempstr.trim());
  }

  return out;
}

bot.on('message', message => {
  let prefix = '~';

  if(message.content.startsWith(prefix) && message.content.trim().length > prefix.length){
    let args = parseArgs(message.content.trim().substring(prefix.length, message.content.length));
    let cmd = args.shift().toLowerCase();

    let cmdKeys = Object.keys(commands);
    for(let i = 0; i < cmdKeys.length; i++){
      if(cmd == commands[cmdKeys[i]].call.toLowerCase()){
        try {
          commands[cmdKeys[i]].onCall(message, args);
        } catch(err) {
          message.channel.send(`Bug found!\`\`\`\n${err.stack}\`\`\``).catch(console.log);
        }
        break;
      }
    }
  }
});
