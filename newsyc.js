#!/usr/bin/env node

const List = require("term-list"),
  list = new List({ marker: "\033[36m› \033[0m", markerLength: 2 }),
  exec = require("child_process").exec,
  news = {};

list.on("keypress", function (key, item) {
  var url;
  switch (key.name) {
    case "l":
    case "return":
      url = news[item].url;
    case "h":
    case "space":
      url = url || "https://news.ycombinator.com/item?id=" + item;

      list.stop();
      console.log("opening %s ...", url);
      exec('open "' + url + '"');

      setTimeout(function () {
        list.start();
      }, 2000);
      break;

    case "q":
    case "c":
    case "escape":
      list.stop();
      process.exit();
  }
});

console.log("Fetching news...");

async function fetchNews() {
  const { default: fetch } = await import("node-fetch");
  const r = await fetch(
    "https://hacker-news.firebaseio.com/v0/newstories.json"
  );
  const j = await r.json();
  return Promise.all(
    j.slice(0, 5).map((id) => fetch(
      `https://hacker-news.firebaseio.com/v0/item/${id}.json`
    ).then((item) => item.json()))
  );
}

fetchNews()
  .then((items) => {
    if (!items.length) {
      throw new Error("HN is probably down :-(");
    }
    console.log(items);
    items.forEach(function (o) {
      news[o.id] = o;
      list.add(o.id, o.title);
    });
  })
  .then(
    (items) => {
      list.start();
    },
    (err) => {
      console.error(err);
      process.exit(1);
    }
  );
