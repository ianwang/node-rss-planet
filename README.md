node-rss-planet
===============

RSS Feed Aggregator on NodeJS


## Quick Start

copy & paste

```
$ git clone git@github.com:IanWang/node-rss-planet.git && cd node-rss-planet && npm start
``` 

## Add New Source

just add the news feed url at

```
./config/feeds.js
```

```
var blogs = [
  'http://feeds.feedburner.com/TechCrunch',
  'http://feeds.mashable.com/Mashable',
  ...
];
```