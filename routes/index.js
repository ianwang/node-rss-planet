
var FeedParser = require('feedparser'),
    async      = require('async'),
    request    = require('request'),
    moment     = require('moment'),
    sites      = require('../config/feeds.js');

exports.index = function(req, res){

  var source = sites;

  console.log('source', source);
  fetchRSS(source, function(data) {
    
    console.log('raw', data[0].posts);

    res.render('index', { 
      title: 'Node.js RSS Planet',
      data: data
    });

  }); 
};

function fetchRSS(feeds, cb) {
  
  var output = [];

  async.eachSeries(feeds, function(feedUrl, finish) {

    var req = request(feedUrl, {timeout: 10000, pool: false});
    var feedparser = new FeedParser();
    var items = [];
    var thisBlog = {};

    req.setMaxListeners(50);

    req.setHeader(
      'user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36')
       .setHeader('accept', 'text/html,application/xhtml+xml');

    // Define our handlers
    req.on('error', done);
    req.on('response', function(res) {
    
      var stream = this;

      if(res.statusCode !== 200) {
        return this.emit('error', new Error('Bad status code'));
      }

      stream.pipe(feedparser);

    });

    feedparser.on('error', function(error) {
      finish(error);
    });

    feedparser.on('readable', function() {

      var stream = this,
          meta = this.meta,
          item = stream.read();

      var content = {
        title: item.title,
        summary: item.summary,
        pubDate: moment(item.pubDate).format('lll'),
        link: item.link,
        author: item.author,
        categories: item.categories
      };

      items.push(content);
      thisBlog.meta = meta;

    });

    feedparser.on('end', function() {

      thisBlog.posts = items;
      output.push(thisBlog);
      finish();

    });

  }, function(err) {
  
    if(err) {
      throw err;
    }

    cb(output);

  });
  

}

function done(err) {
  if(err) {
    console.log(err, err.stack);
    return process.exit(1);
  }
  process.exit();
}
