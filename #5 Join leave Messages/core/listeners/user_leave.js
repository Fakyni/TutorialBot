bot.on('guildMemberRemove', member => {
  member.guild.setupData();
  let leave = data.guilds[member.guild.id].leave;
  if(leave.enabled){
    let channel = member.guild.channels.get(leave.channel);
    if(channel){
      channel.message(
        leave.message
          .replace('$name', member.user.username)
          .replace('$dname', member.displayName)
          .replace("$discrim", member.user.discriminator)
          .replace('$tag', member.user.tag)
          .replace('$id', member.user.id)
          .replace('$@user', member.user)
          .replace('$count', member.guild.members.size)
          .replace('$guild', member.guild.name)
      );
    }
  }
});
