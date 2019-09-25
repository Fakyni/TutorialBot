bot.on('guildMemberAdd', member => {
  member.guild.setupData();
  let join = data.guilds[member.guild.id].join;
  if(join.enabled){
    let channel = member.guild.channels.get(join.channel);
    if(channel && join.sendMessage){
      channel.message(
        join.message
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

    let roles = Object.keys(join.roles);
    for(let i = 0; i < roles.length; i++){
      let role = member.guild.roles.get(roles[i]);
      if(role){
        member.addRole(role.id).catch(err => {
          if(err){
            member.user.message('Unable to assign role <@&' + role.id + ">! The owner has been told about this inconvenience.");

            member.guild.owner.user.message('I was unable to assign role <@$' + role.id + "> to <@" + member.user.id + ">. Below is the full error. To sumarize it, this either happens when the role is below my role, or I don't have access to manage roles.```\n" + err + "```");
          }
        });
      }
    }
  }
});
