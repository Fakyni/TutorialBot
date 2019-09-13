Discord.Guild.prototype.setupData = function(){
  if(!data.guilds[this.id]) data.guilds[this.id] = {};
  copyTable(data.guilds[this.id], file.default.guild);
  this.saveData();
}
Discord.Guild.prototype.saveData = function(){
  if(!data.guilds[this.id]) data.guilds[this.id] = copyTable({}, file.default.guild);
  fs.open(`./data/guilds/${this.id}.json`, 'w', (err, fd) => {
    if(err){
      console.log(err.stack);
      return;
    }
    fs.write(fd, JSON.stringify(data.guilds[this.id], null, 2), err => {
      if(err) console.log(err.stack);
    });
  });
}
Discord.Guild.prototype.resetData = function(){
  data.guilds[this.id] = copyTable({}, file.default.guild);
  this.saveData();
}
