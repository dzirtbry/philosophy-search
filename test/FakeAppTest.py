__author__ = 'dzirtbry'

import unittest


def fun(x):
    return x + 1


class MyTest(unittest.TestCase):
    def test(self):
        self.assertEqual(fun(3), 4)

    def test2(self):
        self.assertEqual(5, 5)
