import numpy as np

LAT = 0 #index of latitude
LONG = 1 # index of longatude

def is_close(base_location : tuple[int,int], test_location : tuple[int,int], bound : int):
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