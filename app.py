import os
import re
import json
import logging
import cherrypy

from lxml import html
from urllib2 import urlopen, unquote, HTTPError

WIKI_ROOT = 'https://en.wikipedia.org'

philosophy_cache = {}
staticDir = './frontend/src/'


class StaticService(object):
    @cherrypy.expose
    def index(self):
        return open(staticDir + 'index.html')


class UrlTracerWebService(object):
    exposed = True
    ROOT_PATTERN = re.compile('https?://.+\.wikipedia\.org', re.IGNORECASE)

    def find_next_word(self, url):

        root = self.ROOT_PATTERN.search(url).group()
        try:
            tree = html.parse(urlopen(url))
        except HTTPError:
            logging.warn("Can't find page at " + url)
            raise cherrypy.HTTPError(400, "No such page")
        wiki_links = tree.xpath('//*[@id="mw-content-text"]/p/a[starts-with(@href, "/wiki")] '
                                '| //*[@id="mw-content-text"]/ul/li/a[starts-with(@href, "/wiki")]')
        if len(wiki_links) == 0:
            logging.info(url + " ia a dead end")
            return "Dead End", ""

        page_name = wiki_links[0].attrib['title']
        page_url = root + wiki_links[0].attrib['href']
        logging.info(url + " continues to " + page_name + " - " + page_url)
        return page_name, page_url

    @cherrypy.tools.accept(media='text/plain')
    def GET(self, url=""):
        next_word, next_url = self.find_next_word(url)
        return json.dumps({"name": next_word, "url": next_url})


class PhilosophyUrlWebService(object):
    exposed = True

    def find_philosophy(self, lang):
        if lang == 'en':
            return "Philosophy", WIKI_ROOT + "/wiki/Philosophy"
        if lang in philosophy_cache:
            return philosophy_cache[lang]['name'], philosophy_cache[lang]['url']

        filename_or_url = urlopen(WIKI_ROOT + "/wiki/Philosophy")
        tree = html.parse(filename_or_url)
        wiki_links = tree.xpath('//*[@id="p-lang"]/div/ul/li/a[@lang="' + lang + '"]')
        if len(wiki_links) == 0:
            raise cherrypy.HTTPError(400, "No philosophy in this language")

        page_url = 'https:' + wiki_links[0].attrib['href']
        page_name = unquote(page_url).split("/")[-1]
        philosophy_cache[lang] = {'name': page_name, 'url': page_url}
        return page_name, page_url

    @cherrypy.tools.accept(media='text/plain')
    def GET(self, lang=""):
        next_word, next_url = self.find_philosophy(lang)
        return json.dumps({"name": next_word, "url": next_url})

def CORS():
    cherrypy.response.headers["Access-Control-Allow-Origin"] = "http://philosophy.dzirtbry.com"


def jsonify_error(status, message, traceback, version):
    response = cherrypy.response
    response.headers['Content-Type'] = 'application/json'
    return json.dumps({'status': status, 'message': message})


if __name__ == '__main__':

    isDev = os.environ.get('IS_DEV', 'True')
    staticDir = './frontend/src/' if isDev == 'True' else './frontend/dist/app/'

    conf = {
        'global': {
            'error_page.default': jsonify_error,
            'server.socket_host': '0.0.0.0',
            'server.socket_port': int(os.environ.get('PORT', '5000')),
            'tools.staticdir.root': os.path.abspath(os.getcwd()),
        },
        '/': {
            'tools.sessions.on': True,
            'tools.staticdir.on' : True,
            'tools.staticdir.dir': staticDir
        },
        '/wiki': {
            'request.dispatch': cherrypy.dispatch.MethodDispatcher(),
            'tools.CORS.on': True,
            'tools.response_headers.on': True,
            'tools.response_headers.headers': [('Content-Type', 'application/json')],
        },
        '/wiki/philosophy': {
            'request.dispatch': cherrypy.dispatch.MethodDispatcher(),
            'tools.CORS.on': True,
            'tools.response_headers.on': True,
            'tools.response_headers.headers': [('Content-Type', 'application/json')],
        },
    }
    cherrypy.tools.CORS = cherrypy.Tool('before_handler', CORS)
    webapp = StaticService()
    webapp.wiki = UrlTracerWebService()
    webapp.wiki.philosophy = PhilosophyUrlWebService()
    cherrypy.quickstart(webapp, '/', conf)
