new Command({
  title: "Load Core Files",
  description: "Reload a core file.",
  call: 'load_core',
  onCall: function(message, args){
    let can = file.developers.includes(message.author.id);
    if(can){
      if(args[0]){
        if(args[0] === '*'){
          reloadCore();
          message.channel.message('Reloading core...');
        } else {
          let err = loadCoreFile(args[0]);
          if(err) message.channel.message(`\`\`\`\n${err}\`\`\``);
          else message.channel.message('Successfully reloaded file!');
        }
      } else message.channel.message('You must specify the core file to reload.');
    } else message.channel.message('You must be a developer to use this command.');
  }
});
