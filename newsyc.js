var List = require('term-list')
  , list = new List({ marker: '\033[36m› \033[0m', markerLength: 2 })
  , exec = require('child_process').exec
  , news = {};

list.on('keypress', function(key, item){
  var url;
  switch (key.name) {
    case 'return':
      url = news[item].url;
    case 'space':
      url = url || 'https://news.ycombinator.com/item?id='+item;
      list.stop();
      exec('open ' + url);
      console.log('opening %s', url);
      process.exit();
  }
});

console.log("Fetching news...");

require("hn.js").home(function(err, items) {
  if(err) return console.error(err);

  items.forEach(function(o){
    news[o.id] = o;
    list.add(o.id, o.title);
  });

  list.start();
});