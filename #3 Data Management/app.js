global.Discord = require('discord.js');
global.fs = require('fs');

global.bot = new Discord.Client();
console.log('Booting!');

global.file = JSON.parse(fs.readFileSync('./bot.json'));
bot.login(file.token);

global.data = {users: {}, guilds: {}};
fs.readdir('./data/users', (err, files) => {
  if(err){
    console.log(err.stack);
    return;
  }
  for(let i = 0; i < files.length; i++){
    let id = files[i].substring(0, files[i].indexOf('.'));
    fs.readFile('./data/users/' + files[i], (error, userdata) => {
      if(error){
        console.log(error.stack);
        return;
      }
      try {
        data.users[id] = JSON.parse(userdata);
      } catch(errr){
        console.log("Error loading data for user " + id + '\n' + errr.stack);
        data.users[id] = copyTable({}, file.default.user);
      }
    });
  }
});
fs.readdir('./data/guilds', (err, files) => {
  if(err){
    console.log(err.stack);
    return;
  }
  for(let i = 0; i < files.length; i++){
    let id = files[i].substring(0, files[i].indexOf('.'));
    fs.readFile('./data/guilds/' + files[i], (error, guilddata) => {
      if(error){
        console.log(error.stack);
        return;
      }
      try {
        data.guilds[id] = JSON.parse(guilddata);
      } catch(errr){
        console.log("Error loading data for guild " + id + '\n' + errr.stack);
        data.guilds[id] = copyTable({}, file.default.guild);
      }
    });
  }
});

console.log('Loading commands!');
global.commands = {};
fs.readdir('./commands', (err, files) => {
  if(err){
    console.log(err.stack);
    return;
  }
  for(let i = 0; i < files.length; i++){
    try {
      require('./commands/' + files[i]);
    } catch(error) {
      console.log('Error loading command ' + files[i] + '\n' + error.stack);
    }
  }
});

global.copyTable = function(obj, temp){
  if(!(typeof obj === "object" && typeof temp === "object")) throw new Error('copyTable: Two objects expected, got ' + typeof obj + ", and" + typeof temp);
  let tempKeys = Object.keys(temp);
  for(let i = 0; i < tempKeys.length; i++){
    if(typeof temp[tempKeys[i]] === "object"){
      if(typeof obj[tempKeys[i]] !== "object") obj[tempKeys[i]] = {};
      Object.setPrototypeOf(obj[tempKeys[i]], temp[tempKeys[i]].__proto__);
      copyTable(obj[tempKeys[i]], temp[tempKeys[i]]);
    } else if(typeof obj[tempKeys[i]] !== typeof temp[tempKeys[i]]) obj[tempKeys[i]] = temp[tempKeys[i]];
  }
  return obj;
}

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

Discord.User.prototype.setupData = function(){
  if(!data.users[this.id]) data.users[this.id] = {};
  copyTable(data.users[this.id], file.default.user);
  this.saveData();
}
Discord.User.prototype.saveData = function(){
  if(!data.users[this.id]) data.users[this.id] = copyTable({}, file.default.user);
  fs.open(`./data/users/${this.id}.json`, 'w', (err, fd) => {
    if(err){
      console.log(err.stack);
      return;
    }
    fs.write(fd, JSON.stringify(data.users[this.id], null, 2), err => {
      if(err) console.log(err.stack);
    });
  });
}
Discord.User.prototype.resetData = function(){
  data.users[this.id] = copyTable({}, file.default.user);
  this.saveData();
}

Discord.Guild.prototype.setupData = function(){
  if(!data.guilds[this.id]) data.guilds[this.id] = {};
  copyTable(data.guilds[this.id], file.default.guild);
  this.saveData();
}
Discord.Guild.prototype.saveData = function(){
  if(!data.guilds[this.id]) data.guilds[this.id] = copyTable({}, file.default.guild);
  fs.open(`./data/guilds/${this.id}.json`, 'w', (err, fd) => {
    if(err){
      console.log(err.stack);
      return;
    }
    fs.write(fd, JSON.stringify(data.guilds[this.id], null, 2), err => {
      if(err) console.log(err.stack);
    });
  });
}
Discord.Guild.prototype.resetData = function(){
  data.guilds[this.id] = copyTable({}, file.default.guild);
  this.saveData();
}

Discord.TextChannel.prototype.message = function(message, attachments){
  return this.send(message, attachments).catch(console.log);
}
Discord.DMChannel.prototype.message = Discord.TextChannel.prototype.message;
Discord.User.prototype.message = Discord.TextChannel.prototype.message;

global.messageDevs = function(message, attachments){
  for(let i = 0; i < file.developers.length; i++){
    if(bot.users.get(file.developers[i])) bot.users.get(file.developers[i]).message(message, attachments);
  }
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
  if(message.guild){
    message.guild.setupData();
    prefix = data.guilds[message.guild.id].prefix;
  }

  if(message.content.startsWith(prefix) && message.content.trim().length > prefix.length){
    let can = !file.maintenance;
    if(!can){
      if(file.developers.includes(message.author.id)) can = true;
    }

    if(can){
      let args = parseArgs(message.content.trim().substring(prefix.length, message.content.length));
      let cmd = args.shift().toLowerCase();

      let cmdKeys = Object.keys(commands);
      for(let i = 0; i < cmdKeys.length; i++){
        if(cmd == commands[cmdKeys[i]].call.toLowerCase()){
          try {
            commands[cmdKeys[i]].onCall(message, args);
          } catch(err) {
            message.channel.message(`Bug found!\`\`\`\n${err.stack}\`\`\``);
          }
          break;
        }
      }
    } else message.channel.message('Bot is currently down for maintenance, please try again later.');
  }
});
