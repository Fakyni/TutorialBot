new Command({
  title: "Set Prefix",
  description: "Set the prefix of a guild [administrators only!]",
  call: "prefix",
  onCall: function(message, args){
    if(message.guild){
      let admin = false;
      if(message.author.id === message.guild.ownerID || message.member.hasPermission('ADMINSTRATOR')) admin = true;

      if(admin){
        if(args[0]){
          message.guild.setupData();
          data.guilds[message.guild.id].prefix = args[0];
          message.guild.saveData();
          message.channel.message('Prefix updated! Now set to **`' + args[0] + "`**!");
        } else message.channel.message('You must specify the new prefix.');
      } else message.channel.message('You must be an administrator to use this.');
    } else message.channel.message('You must be on a guild to use this command.');
  }
});
