new Command({
  title: "List My Arguments",
  description: "Lists arguments you give (how the bot interprets it.)",
  call: "args",
  onCall: function(message, args){
    message.channel.send(JSON.stringify(parseArgs(message.content), null, 2)).catch(console.log);
  }
});
