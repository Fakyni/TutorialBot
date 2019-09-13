// Require our modules for our bot
global.Discord = require('discord.js');
global.fs = require('fs');

// Initialize the bot
global.bot = new Discord.Client();
console.log('Booting!');

// Core files: loadCoreFile(file_name)
//   file_name: the file to be reloaded
// Reloads a core file.
global.loadCoreFile = function(file_name){
  let files = gatherFiles('./core');
  let dir = file_name.split(/\/+/g);
  if(check(files, dir)){
    try {
      delete require.cache[require.resolve('./core/' + file_name)];
      require('./core/' + file_name);
    } catch(err){
      return err.stack;
    }
  }
}

// Core files: reloadCore(dir = "./core")
//   dir: the core files location
// Refreshes all core files.
global.reloadCore = function(dir = './core'){
  let files = fs.readdirSync(dir);
  for(let i = 0; i < files.length; i++){
    if(!files[i].includes('.')){
      reloadCore(dir + "/" + files[i]);
    } else {
      console.log('Loading core file ' + dir + "/" + files[i]);
      delete require.cache[require.resolve(dir + '/' + files[i])];
      require(dir + "/" + files[i]);
    }
  }
}

// INTERNAL
function check(files, dir, ind = 0){
  if(files[dir[ind]]){
    if(dir[ind].includes('.')) return true;
    return check(files[dir[ind]], dir, ind + 1);
  }
  return false;
}

// INTERNAL
function gatherFiles(dir){
  let files = fs.readdirSync(dir);
  let out = {};
  for(let i = 0; i < files.length; i++){
    if(!files[i].includes('.')){
      out[files[i]] =  gatherFiles(dir + "/" + files[i]);
    } else {
      out[files[i]] = true;
    }
  }
  return out;
}

// Load the core
console.log("Loading core files..");
reloadCore();

// Load bot's information and load it.
global.file = JSON.parse(fs.readFileSync('./bot.json'));
bot.login(file.token);

// Loading user data
global.data = {users: {}, guilds: {}};
fs.readdir('./data/users', (err, files) => {
  // If error, let us know
  if(err){
    console.log(err.stack);
    return;
  }

  // Loop through all the user data files
  for(let i = 0; i < files.length; i++){
    // Extract the id from the file name
    let id = files[i].substring(0, files[i].indexOf('.'));

    // Read their file
    fs.readFile('./data/users/' + files[i], (error, userdata) => {
      // Let us know if there was an error
      if(error){
        console.log(error.stack);
        return;
      }

      // Try assigning their data to a table
      try {
        data.users[id] = JSON.parse(userdata);
      } catch(errr){
        console.log("Error loading data for user " + id + '\n' + errr.stack);
        data.users[id] = copyTable({}, file.default.user);
      }
    });
  }
});

// Load guild data
fs.readdir('./data/guilds', (err, files) => {
  // Let us know if there was an error
  if(err){
    console.log(err.stack);
    return;
  }

  // Loop through all files
  for(let i = 0; i < files.length; i++){
    // Extract the guild id from the file name
    let id = files[i].substring(0, files[i].indexOf('.'));

    // Read the guild data
    fs.readFile('./data/guilds/' + files[i], (error, guilddata) => {
      // Let us know if there was an error
      if(error){
        console.log(error.stack);
        return;
      }

      // Try assigning the data to a data table
      try {
        data.guilds[id] = JSON.parse(guilddata);
      } catch(errr){
        console.log("Error loading data for guild " + id + '\n' + errr.stack);
        data.guilds[id] = copyTable({}, file.default.guild);
      }
    });
  }
});

// Loading commands
console.log('Loading commands!');

// Create the object that holds all commands
global.commands = {};

// Read all commands
fs.readdir('./commands', (err, files) => {
  // Let us know if there was an error
  if(err){
    console.log(err.stack);
    return;
  }

  // Loop through all files
  for(let i = 0; i < files.length; i++){
    // Try requiring the file
    try {
      require('./commands/' + files[i]);
    } catch(error) {
      console.log('Error loading command ' + files[i] + '\n' + error.stack);
    }
  }
});
