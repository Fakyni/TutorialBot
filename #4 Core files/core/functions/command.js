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
