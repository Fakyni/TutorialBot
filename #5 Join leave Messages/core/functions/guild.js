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

Discord.Guild.prototype.findChannel = function(search, returnlist = true, v = ''){
  if(!(typeof search === "string" || typeof search === "object")) throw new Error('Guild.findChannel: Bad argument #1: String or object expected, got ' + typeof search);
  if(typeof returnlist !== "boolean") throw new Error('Guild.findChannel: Bad argument #2: Boolean expected, got ' + typeof returnlist);
  if(typeof v !== "string") throw new Error('Guild.findChannel: Bad argument #3: String expected, got ' + typeof v);

  let out = [];
  if(typeof search === "string"){
    if(this.channels.get(search)) out.push(v.length ? this.channels.get(search)[v] : this.channels.get(search));
    else if(search.match(/<#[0-9]+>/)){
      if(this.channels.get(search.match(/[0-9]+/)[0])) out.push(v.length ? this.channels.get(search.match(/[0-9]+/)[0])[v] : this.channels.get(search.match(/[0-9]+/)[0]));
    } else {
      this.channels.forEach((channel, key, map) => {
        if(channel.name.toLowerCase().includes(search.toLowerCase())) out.push(v.length ? channel[v] : channel);
      });
    }
  } else if(typeof search === "object"){
    for(let i = 0; i < search.length; i++){
      if(this.channels.get(search[i])) out.push(v.length ? this.channels.get(search[i])[v] : this.channels.get(search[i]));
      else if(search[i].match(/<#[0-9]+>/)){
        if(this.channels.get(search[i].match(/[0-9]+/)[0])) out.push(v.length ? this.channels.get(search[i].match(/[0-9]+/)[0])[v] : this.channels.get(search[i].match(/[0-9]+/)[0]));
      } else {
        this.channels.forEach((channel, key, map) => {
          if(channel.name.toLowerCase().includes(search[i].toLowerCase())) out.push(v.length ? channel[v] : channel);
        });
      }
    }
  }

  return returnlist ? out : out[0];
}

Discord.Guild.prototype.findRole = function(search, returnlist = true, v = ''){
  if(!(typeof search === "string" || typeof search === "object")) throw new Error('Guild.findChannel: Bad argument #1: String or object expected, got ' + typeof search);
  if(typeof returnlist !== "boolean") throw new Error('Guild.findChannel: Bad argument #2: Boolean expected, got ' + typeof returnlist);
  if(typeof v !== "string") throw new Error('Guild.findChannel: Bad argument #3: String expected, got ' + typeof v);

  let out = [];
  if(typeof search === "string"){
    if(this.roles.get(search)) out.push(v.length ? this.roles.get(search)[v] : this.roles.get(search));
    else if(search.match(/<#[0-9]+>/)){
      if(this.roles.get(search.match(/[0-9]+/)[0])) out.push(v.length ? this.roles.get(search.match(/[0-9]+/)[0])[v] : this.roles.get(search.match(/[0-9]+/)[0]));
    } else {
      this.roles.forEach((channel, key, map) => {
        if(channel.name.toLowerCase().includes(search.toLowerCase())) out.push(v.length ? channel[v] : channel);
      });
    }
  } else if(typeof search === "object"){
    for(let i = 0; i < search.length; i++){
      if(this.roles.get(search[i])) out.push(v.length ? this.roles.get(search[i])[v] : this.roles.get(search[i]));
      else if(search[i].match(/<#[0-9]+>/)){
        if(this.roles.get(search[i].match(/[0-9]+/)[0])) out.push(v.length ? this.roles.get(search[i].match(/[0-9]+/)[0])[v] : this.roles.get(search[i].match(/[0-9]+/)[0]));
      } else {
        this.roles.forEach((channel, key, map) => {
          if(channel.name.toLowerCase().includes(search[i].toLowerCase())) out.push(v.length ? channel[v] : channel);
        });
      }
    }
  }

  return returnlist ? out : out[0];
}
