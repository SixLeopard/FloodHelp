###############################################
# Description
###############################################
# tool to check if coordiants are close
# where close is defined by bound
###############################################
# Setup
###############################################
import numpy as np
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

LAT = 0 #index of latitude
LONG = 1 # index of longatude

def is_close(base_location : tuple[float,float], test_location : tuple[float,float], bound : float) -> bool:
    '''
    return wether the distance between base location adn test location is less than the
    bound distance

    paramters:
        test_location:
            tuple of the form (lat,long)
            the loction the test the distance from the base loation
        bas_location:
            tuple of the form (lat,long)
            the location to tset how far the test distance is fromm

        returns:
            true if is close
            false if no close
    '''
    # sqrt((Alat-Blat)^2+(Along-Blong)^2)
    if \
    np.sqrt(
        np.square(
            base_location[LAT]-test_location[LAT]
            ) 
            + 
            np.square(
                base_location[LONG]-test_location[LONG]
                )
        ) \
    <= bound: #when in bound true else false
        return True
    else:
        return False
