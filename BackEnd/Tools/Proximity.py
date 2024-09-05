import numpy as np

LAT = 0
LONG = 1

def is_close(base_location : tuple[int,int], test_location : tuple[int,int], bound : int):
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
    <= bound:
        return True
    else:
        return False