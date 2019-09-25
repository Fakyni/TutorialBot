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
