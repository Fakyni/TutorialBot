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
