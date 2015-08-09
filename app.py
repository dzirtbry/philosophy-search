import os
import json
import random
import string
import cherrypy

from lxml import html
from urllib2 import urlopen

WIKI_ROOT = 'https://en.wikipedia.org'


class StringGenerator(object):
    @cherrypy.expose
    def index(self):
        return open('public/index.html')


class StringGeneratorWebService(object):
    exposed = True

    def find_next_word(self, url):
        tree = html.parse(urlopen(url))
        xpath = tree.xpath('//*[@id="mw-content-text"]/p[1]/a[starts-with(@href, "/wiki")]')
        page_name = xpath[0].text
        page_url = WIKI_ROOT + xpath[0].attrib['href']
        return page_name, page_url

    @cherrypy.tools.accept(media='text/plain')
    def GET(self, url):
        next_word, next_url = self.find_next_word(url)
        return json.dumps({"name": next_word, "url": next_url})

    def POST(self, length=8):
        some_string = ''.join(random.sample(string.hexdigits, int(length)))
        cherrypy.session['mystring'] = some_string
        return some_string

    def PUT(self, another_string):
        cherrypy.session['mystring'] = another_string

    def DELETE(self):
        cherrypy.session.pop('mystring', None)


if __name__ == '__main__':
    conf = {
        'global': {
            'server.socket_host': '0.0.0.0',
            'server.socket_port': 9999
        },
        '/': {
            'tools.sessions.on': True,
            'tools.staticdir.root': os.path.abspath(os.getcwd())
        },
        '/wiki': {
            'request.dispatch': cherrypy.dispatch.MethodDispatcher(),
            'tools.response_headers.on': True,
            'tools.response_headers.headers': [('Content-Type', 'text/plain')],
        },
        '/static': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': './public'
        }
    }
    webapp = StringGenerator()
    webapp.wiki = StringGeneratorWebService()
    cherrypy.quickstart(webapp, '/', conf)



# if __name__ == '__main__':
# cherrypy.quickstart(HelloWorld())
