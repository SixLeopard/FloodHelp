###############################################
# Description
###############################################
# unit tests for some of the tools
###############################################
# Setup
###############################################
import unittest
import Proximity
import CoordString_to_Tuple as convcord
###############################################
# File Info
###############################################
__author__ = 'FloodHelp BeckEnd Team'
__copyright__ = 'Copyright 2024, FloodHelp API'
__credits__ = ['Flask', 'Autodoc']
__license__ = 'All Rights Reserved'
__version__ = '0.8.9'
__maintainer__ = 'FloodHelp BeckEnd Team'
__status__ = 'Prototype'
###############################################


class TestProximity(unittest.TestCase):
    
    def test_in_bound(self):
        base = (10.0,8.1)
        test = (-2.2,-1.1)
        bound = 20
        self.assertTrue(Proximity.is_close(base, test, bound))
    
    def test_out_bound(self):
        base = (10,8)
        test = (-2,-1)
        bound = 10
        self.assertFalse(Proximity.is_close(base, test, bound))

if __name__ == '__main__':
    print(convcord.convert("(12.12312,10.11)"))
    print(convcord.convert("(43535,4234234)"))
    unittest.main(verbosity=3)
