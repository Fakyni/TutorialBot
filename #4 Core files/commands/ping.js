new Command({
  title: "Ping",
  description: "Check if the bot is running.",
  call: "ping",
  onCall: function(message, args){
    message.channel.send('pinging..').then(newMsg => {
      newMsg.edit(`Pong! Took ${newMsg.createdTimestamp - message.createdTimestamp} milliseconds to respond.`);
    }).catch(console.log);
  }
});
