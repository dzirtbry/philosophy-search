import os
import json
import cherrypy

from lxml import html
from urllib2 import urlopen

WIKI_ROOT = 'https://en.wikipedia.org'


class StringGenerator(object):
    @cherrypy.expose
    def index(self):
        return open('static/index.html')


class StringGeneratorWebService(object):
    exposed = True

    def find_next_word(self, url):
        tree = html.parse(urlopen(url))
        xpath = tree.xpath('//*[@id="mw-content-text"]/p[1]/a[starts-with(@href, "/wiki")]')
        page_name = xpath[0].text
        page_url = WIKI_ROOT + xpath[0].attrib['href']
        return page_name, page_url

    @cherrypy.tools.accept(media='text/plain')
    def GET(self, url=""):
        next_word, next_url = self.find_next_word(url)
        return json.dumps({"name": next_word, "url": next_url})


if __name__ == '__main__':
    conf = {
        'global': {
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
        '/static': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': './static'
        }
    }
    webapp = StringGenerator()
    webapp.wiki = StringGeneratorWebService()
    cherrypy.quickstart(webapp, '/', conf)