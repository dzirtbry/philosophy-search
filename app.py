import os
import re
import json
import cherrypy

from lxml import html
from urllib2 import urlopen, unquote, HTTPError

WIKI_ROOT = 'https://en.wikipedia.org'

philosophy_cache = {}


class StaticService(object):
    @cherrypy.expose
    def index(self):
        return open('static/index.html')


class UrlTracerWebService(object):
    exposed = True
    ROOT_PATTERN = re.compile('https?://.+\.wikipedia\.org', re.IGNORECASE)

    def find_next_word(self, url):
        root = self.ROOT_PATTERN.search(url).group()
        try:
            tree = html.parse(urlopen(url))
        except HTTPError:
            raise cherrypy.HTTPError(400, "No such page")
        wiki_links = tree.xpath('//*[@id="mw-content-text"]/p/a[starts-with(@href, "/wiki")]')
        if len(wiki_links) == 0:
            return "Dead End", ""

        page_name = wiki_links[0].attrib['title']
        page_url = root + wiki_links[0].attrib['href']
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


def jsonify_error(status, message, traceback, version):
    response = cherrypy.response
    response.headers['Content-Type'] = 'application/json'
    return json.dumps({'status': status, 'message': message})

if __name__ == '__main__':
    conf = {
        'global': {
            'error_page.default': jsonify_error,
            'server.socket_host': '0.0.0.0',
            'server.socket_port': int(os.environ.get('PORT', '5000'))
        },
        '/': {
            'tools.sessions.on': True,
            'tools.staticdir.root': os.path.abspath(os.getcwd())
        },
        '/wiki': {
            'request.dispatch': cherrypy.dispatch.MethodDispatcher(),
            'tools.response_headers.on': True,
            'tools.response_headers.headers': [('Content-Type', 'application/json')],
        },
        '/wiki/philosophy': {
            'request.dispatch': cherrypy.dispatch.MethodDispatcher(),
            'tools.response_headers.on': True,
            'tools.response_headers.headers': [('Content-Type', 'application/json')],
        },
        '/static': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': './static'
        }
    }
    webapp = StaticService()
    webapp.wiki = UrlTracerWebService()
    webapp.wiki.philosophy = PhilosophyUrlWebService()
    cherrypy.quickstart(webapp, '/', conf)
