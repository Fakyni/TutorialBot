Discord.User.prototype.setupData = function(){
  if(!data.users[this.id]) data.users[this.id] = {};
  copyTable(data.users[this.id], file.default.user);
  this.saveData();
}
Discord.User.prototype.saveData = function(){
  if(!data.users[this.id]) data.users[this.id] = copyTable({}, file.default.user);
  fs.open(`./data/users/${this.id}.json`, 'w', (err, fd) => {
    if(err){
      console.log(err.stack);
      return;
    }
    fs.write(fd, JSON.stringify(data.users[this.id], null, 2), err => {
      if(err) console.log(err.stack);
    });
  });
}
Discord.User.prototype.resetData = function(){
  data.users[this.id] = copyTable({}, file.default.user);
  this.saveData();
}
