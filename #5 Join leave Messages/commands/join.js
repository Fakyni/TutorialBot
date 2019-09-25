new Command({
  title: "Join",
  call: "join",
  onCall: function(message, args){
    if(message.guild){
      if(message.author.id === message.guild.ownerID || message.member.hasPermission('ADMINISTRATOR')){
        switch(args[0].toLowerCase()){
          case "toggle": {
            data.guilds[message.guild.id].join.enabled = !data.guilds[message.guild.id].join.enabled;
            message.guild.saveData();
            message.channel.message('Join roles/messages are now **' + (data.guilds[message.guild.id].join.enabled ? "enabled" : "disabled") + '**.');
          }break;

          case "msgtoggle": {
            data.guilds[message.guild.id].join.sendMessage = !data.guilds[message.guild.id].join.sendMessage;
            message.guild.saveData();
            message.channel.message('Join messages are now **' + (data.guilds[message.guild.id].join.sendMessage ? "enabled" : "disabled") + '**.');
          }break;

          case "message": {
            args.shift();
            if(args.length > 0){
              data.guilds[message.guild.id].join.message = args.join(' ');
              message.guild.saveData();
              message.channel.message('Join message updated.```\n' + args.join(' ') + '```');
            } else message.channel.message('You must specify a message.');
          }break;

          case "channel": {
            if(args[1]){
              let channel = message.guild.findChannel(args[1]);
              if(channel.length === 1){
                data.guilds[message.guild.id].join.channel = channel[0].id;
                message.guild.saveData();
                message.channel.message('Join message channel set to ' + channel[0] + ".");
              } else if(channel.length > 1) message.channel.message('More than one channel found, please be more specific.');
              else message.channel.message('No channels were found, please be less specific.');
            } else {
              data.guilds[message.guild.id].join.channel = message.channel.id;
              message.guild.saveData();
              message.channel.message('Join message channel set to ' + message.channel + ".");
            }
          }break;

          case "role": {
            if(args[1]){
              switch(args[1].toLowerCase()){
                case "add": {
                  args.shift();
                  args.shift();
                  if(args.length > 0){
                    let roles = message.guild.findRole(args);
                    if(roles.length > 0){
                      for(let i = 0; i < roles.length; i++){
                        data.guilds[message.guild.id].join.roles[roles[i].id] = roles[i].name;
                      }

                      let rn = [];
                      let jroles = Object.keys(data.guilds[message.guild.id].join.roles);
                      for(let i = 0; i < jroles.length; i++){
                        if(message.guild.roles.get(jroles[i])) rn.push(message.guild.roles.get(jroles[i]).name);
                        else delete data.guilds[message.guild.id].join.roles[jroles[i]];
                      }

                      message.guild.saveData();
                      message.channel.message('Join roles updated.```\n' + rn.join('\n') + '```');
                    } else message.channel.message('Invalid role(s).');
                  } else message.channel.message('You must input at least one role.');
                }break;

                case "remove": {
                  args.shift();
                  args.shift();
                  if(args.length > 0){
                    let roles = message.guild.findRole(args);
                    if(roles.length > 0){
                      for(let i = 0; i < roles.length; i++){
                        delete data.guilds[message.guild.id].join.roles[roles[i].id];
                      }

                      let rn = [];
                      let jroles = Object.keys(data.guilds[message.guild.id].join.roles);
                      for(let i = 0; i < jroles.length; i++){
                        if(message.guild.roles.get(jroles[i])) rn.push(message.guild.roles.get(jroles[i]).name);
                        else delete data.guilds[message.guild.id].join.roles[jroles[i]];
                      }

                      message.guild.saveData();
                      message.channel.message('Join roles updated.```\n' + rn.join('\n') + '```');
                    } else message.channel.message('Invalid role(s).');
                  } else message.channel.message('You must input at least one role.');
                }break;

                default: message.channel.message('Invalid role property.'); break;
              }
            } else message.channel.message('You must specify whether to add or remove a role.');
          }break;

          default: message.channel.message('Invalid join property.'); break;
        }
      } else message.channel.message('You must be a server administrator to use this command.');
    } else message.channel.message('You must be on a guild to use this command.');
  }
});
