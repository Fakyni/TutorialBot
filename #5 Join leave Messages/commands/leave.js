new Command({
  title: "Leave",
  call: "leave",
  onCall: function(message, args){
    if(message.guild){
      if(message.author.id === message.guild.ownerID || message.member.hasPermission('ADMINISTRATOR')){
        switch(args[0].toLowerCase()){
          case "toggle": {
            data.guilds[message.guild.id].leave.enabled = !data.guilds[message.guild.id].leave.enabled;
            message.guild.saveData();
            message.channel.message('Leave messages are now **' + (data.guilds[message.guild.id].leave.enabled ? "enabled" : "disabled") + '**.');
          }break;

          case "message": {
            args.shift();
            if(args.length > 0){
              data.guilds[message.guild.id].leave.message = args.join(' ');
              message.guild.saveData();
              message.channel.message('Leave message updated.```\n' + args.join(' ') + '```');
            } else message.channel.message('You must specify a message.');
          }break;

          case "channel": {
            if(args[1]){
              let channel = message.guild.findChannel(args[1]);
              if(channel.length === 1){
                data.guilds[message.guild.id].leave.channel = channel[0].id;
                message.guild.saveData();
                message.channel.message('Leave message channel set to ' + channel[0] + ".");
              } else if(channel.length > 1) message.channel.message('More than one channel found, please be more specific.');
              else message.channel.message('No channels were found, please be less specific.');
            } else {
              data.guilds[message.guild.id].leave.channel = message.channel.id;
              message.guild.saveData();
              message.channel.message('Leave message channel set to ' + message.channel + ".");
            }
          }break;

          default: message.channel.message('Invalid leave property.'); break;
        }
      } else message.channel.message('You must be a server administrator to use this command.');
    } else message.channel.message('You must be on a guild to use this command.');
  }
});
