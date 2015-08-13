import sys
import re
from lxml import html
from urllib2 import urlopen

WIKI_ROOT = 'https://en.wikipedia.org'

# https://ru.wikipedia.org/wiki/%D0%97%D0%B0%D0%B3%D0%BB%D0%B0%D0%B2%D0%BD%D0%B0%D1%8F_%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D0%B0
root_re = re.compile('https?://.+\.wikipedia\.org/wiki/', re.IGNORECASE)

def find_next_word(url):
    root = root_re.search(url).group()
    tree = html.parse(urlopen(url))
    xpath = tree.xpath('//*[@id="mw-content-text"]/p[1]/a[starts-with(@href, "/wiki")]')
    page_name = xpath[0].text
    page_url = root + xpath[0].attrib['href']
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
    # url = sys.argv[1]
    url = "https://ru.wikipedia.org/wiki/%D0%9A%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%D0%BD%D0%B0%D1%8F_%D0%B8%D0%B3%D1%80%D0%B0"
    word = url[url.rfind("/") + 1:]
    find_path(word, url, "Philosophy")


if __name__ == '__main__':
    main()
