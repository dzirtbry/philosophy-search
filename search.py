from lxml import html
from urllib2 import urlopen
import sys

WIKI_ROOT = 'https://en.wikipedia.org'


def find_next_word(url):
    tree = html.parse(urlopen(url))
    xpath = tree.xpath('//*[@id="mw-content-text"]/p[1]/a[starts-with(@href, "/wiki")]')
    page_name = xpath[0].text
    page_url = WIKI_ROOT + xpath[0].attrib['href']
    return page_name, page_url


def find_path(start, start_url, finish, path=None):
    print start, start_url
    if not path:
        path = []
    path.append((start, start_url))
    if start.lower() == finish.lower():
        return path

    if any(x[0].lower() == start.lower() for x in path[:-1]):
        print "Circular links detected"
        return path

    next_word, next_word_url = find_next_word(start_url)
    return find_path(next_word, next_word_url, finish, path)


def main():
    url = sys.argv[1]
    word = url[url.rfind("/") + 1:]
    find_path(word, url, "Philosophy")


if __name__ == '__main__':
    main()
