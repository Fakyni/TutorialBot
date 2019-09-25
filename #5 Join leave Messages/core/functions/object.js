global.copyTable = function(obj, temp){
  if(!(typeof obj === "object" && typeof temp === "object")) throw new Error('copyTable: Two objects expected, got ' + typeof obj + ", and" + typeof temp);
  let tempKeys = Object.keys(temp);
  for(let i = 0; i < tempKeys.length; i++){
    if(typeof temp[tempKeys[i]] === "object"){
      if(typeof obj[tempKeys[i]] !== "object") obj[tempKeys[i]] = {};
      Object.setPrototypeOf(obj[tempKeys[i]], temp[tempKeys[i]].__proto__);
      copyTable(obj[tempKeys[i]], temp[tempKeys[i]]);
    } else if(typeof obj[tempKeys[i]] !== typeof temp[tempKeys[i]]) obj[tempKeys[i]] = temp[tempKeys[i]];
  }
  return obj;
}
