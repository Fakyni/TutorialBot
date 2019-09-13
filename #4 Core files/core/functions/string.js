global.parseArgs = function(str){
  let out = [];
  let quote = false;
  let tempstr = '';
  for(let i = 0; i < str.length; i++){
    if(str[i] === " " && !quote && tempstr.trim().length > 0){
      out.push(tempstr.trim());
      tempstr = '';
    } else if(str[i] === '"' && str[i - 1] !== "\\"){
      quote = !quote;
    } else {
      if(str[i] === "\\" && str[i + 1] === '"') continue;
      tempstr += str[i];
    }
  }

  if(tempstr.trim().length > 0){
    out.push(tempstr.trim());
  }

  return out;
}
