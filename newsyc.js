var List = require('term-list')
  , list = new List({ marker: '\033[36m› \033[0m', markerLength: 2 })
  , exec = require('child_process').exec
  , news = {};

list.on('keypress', function(key, item){
  var url;
  switch (key.name) {

    case 'j':
    case 'tab':
      list.down();
      break;

    case 'k':
      list.up();
      break;

    case 'l':
    case 'return':
      url = news[item].url;
    case 'h':
    case 'space':
      url = url || 'https://news.ycombinator.com/item?id='+item;

      list.stop();
      console.log('opening %s ...', url);
      exec('open "' + url + '"');

      setTimeout(function() {
        list.start();
      }, 2000);
      break;

    case 'q':
    case 'c':
    case 'escape':
      list.stop();
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