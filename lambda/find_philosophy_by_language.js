/**
 * Created on 1/7/16.
 *
 * @author dzirtbry
 */
var request = require('request');
var libxmljs = require("libxmljs");


exports.handler = function (event, context) {
  findPhilosophyByLanguage(event.lang, function (title, url) {
    context.succeed({
      name: title,
      url: url
    });
  })
};

WIKI_ROOT = 'https://en.wikipedia.org';

function findPhilosophyByLanguage(lang, callback) {
  if (lang == 'en') {
    callback("Philosophy", WIKI_ROOT + "/wiki/Philosophy");
    return;
  }
  request(WIKI_ROOT + "/wiki/Philosophy", function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var xmlDoc = libxmljs.parseHtmlString(body);

      var select = xmlDoc.get('//*[@id="p-lang"]/div/ul/li/a[@lang="' + lang + '"]');

      if (select === undefined) {
        console.log('No philosophy found in ' + lang);
        var err = new Error('No philosophy in this language(' + lang + ')');
        err.code = 400;
        throw err;
      }

      var pageUrl = 'https:' + select.attr('href').value();
      var pageName = decodeURI(pageUrl).split("/").slice(-1)[0];
      console.log('Philosophy for ' + lang + ' is ' + pageName + " : " + pageUrl);
      callback(pageName, pageUrl)
    } else {
      var err = new Error('No such page');
      err.code = 400;
      throw err;
    }
  });
}

findPhilosophyByLanguage('ru', function (a, b) {
  console.log(a);
  console.log(b);
});