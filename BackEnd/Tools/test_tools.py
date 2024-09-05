#unit tests for tools

import unittest
import Proximity

class TestProximity(unittest.TestCase):
    
    def test_in_bound(self):
        base = (10,8)
        test = (-2,-1)
        bound = 20
        self.assertTrue(Proximity.is_close(base, test, bound))
    
    def test_out_bound(self):
        base = (10,8)
        test = (-2,-1)
        bound = 10
        self.assertFalse(Proximity.is_close(base, test, bound))

if __name__ == '__main__':
    unittest.main(verbosity=3)