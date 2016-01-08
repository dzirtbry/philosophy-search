/**
 * Created on 1/7/16.
 *
 * @author dzirtbry
 */
var request = require('request');
var libxmljs = require("libxmljs");

exports.handler = function (event, context) {
  find_next_word(event.url, function (title, url) {
    context.succeed({
      name: title,
      url: url
    });
  })
};

function find_next_word(url, callback) {
  console.log('Looking up URl : ' + url);
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var xmlDoc = libxmljs.parseHtmlString(body);

      var select = xmlDoc.get('//*[@id="mw-content-text"]/p/a[starts-with(@href, "/wiki")] ' +
        '| //*[@id="mw-content-text"]/ul/li/a[starts-with(@href, "/wiki")]');

      if (select === undefined) {
        console.log('Url ' + url + ' is a dead end');
        callback("Dead end", "");
        return;
      }

      var ROOT_PATTERN = new RegExp('https?://.+\.wikipedia\.org', 'i');
      var root = ROOT_PATTERN.exec(url)[0];

      var pageName = select.attr('title').value();
      var pageUrl = root + select.attr('href').value();
      console.log('Url ' + url + ' leads to ' + pageUrl);
      callback(pageName, pageUrl)
    } else {
      var err = new Error('No such page');
      err.code = 400;
      throw err;
    }
  });
}