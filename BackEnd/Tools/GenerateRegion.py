###############################################
# Description
###############################################
# geneates region from coordiants
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


# {'tl': (-27.5, 153.0), 'tr': (-27.53, 153.0), 'bl': (-27.5, 153.03), 'br': (-27.53, 153.03)

"""
Takes a coordinate and returns the region in which the coordinate is located.
A region is a square where the four corners are defined by the second decimal 
point of the coordinate. Possible value regions for the second decimal point are 
    0 <= x,y < 3
    3 <= x,y < 6
    x, y > 6

For example the following defines the four points of an region
    (xx.x0, yy.y0), (xx.x3, yy.y0), (xx.x0, yy.y3), (xx.x3, yy.y3)

Coordinates passed to the function must be in the form (lattitude, longitude) where 
lattitude and longitude are floating point numbers.
"""
def generate_region(coordinates: tuple[int, int]) \
    -> tuple[tuple[int, int], tuple[int, int], tuple[int, int], tuple[int, int]]:
    latt = coordinates[0]
    long = coordinates[1]

    latt_2_dec = float("{:.2f}".format(latt).split('.')[1][1])
    long_2_dec = float("{:.2f}".format(long).split('.')[1][1])

    region = None

    if latt_2_dec < 3:
        x = 0
        if long_2_dec < 3:
            y = 0
            region = f'({float("{:.1f}".format(latt))}{x}, {float("{:.1f}".format(long))}{y}), ({float("{:.1f}".format(latt))}{x+3}, {float("{:.1f}".format(long))}{y}), ({float("{:.1f}".format(latt))}{x}, {float("{:.1f}".format(long))}{y+3}), ({float("{:.1f}".format(latt))}{x+3}, {float("{:.1f}".format(long))}{y+3})'
        elif long_2_dec < 6:
            y = 3
            region = f'({float("{:.1f}".format(latt))}{x}, {float("{:.1f}".format(long))}{y}), ({float("{:.1f}".format(latt))}{x+3}, {float("{:.1f}".format(long))}{y}), ({float("{:.1f}".format(latt))}{x}, {float("{:.1f}".format(long))}{y+3}), ({float("{:.1f}".format(latt))}{x+3}, {float("{:.1f}".format(long))}{y+3})'
        else:
            y = 6
            region = f'({float("{:.1f}".format(latt))}{x}, {float("{:.1f}".format(long))}{y}), ({float("{:.1f}".format(latt))}{x+399}, {float("{:.1f}".format(long))}{y}), ({float("{:.1f}".format(latt))}{x}, {float("{:.1f}".format(long))}{y+399}), ({float("{:.1f}".format(latt))}{x+399}, {float("{:.1f}".format(long))}{y+399})'
    elif latt_2_dec < 6:
        x = 3
        if long_2_dec < 3:
            y = 0
            region = f'({float("{:.1f}".format(latt))}{x}, {float("{:.1f}".format(long))}{y}), ({float("{:.1f}".format(latt))}{x+3}, {float("{:.1f}".format(long))}{y}), ({float("{:.1f}".format(latt))}{x}, {float("{:.1f}".format(long))}{y+3}), ({float("{:.1f}".format(latt))}{x+3}, {float("{:.1f}".format(long))}{y+3})'
        elif long_2_dec < 6:
            y = 3
            region = f'({float("{:.1f}".format(latt))}{x}, {float("{:.1f}".format(long))}{y}), ({float("{:.1f}".format(latt))}{x+3}, {float("{:.1f}".format(long))}{y}), ({float("{:.1f}".format(latt))}{x}, {float("{:.1f}".format(long))}{y+3}), ({float("{:.1f}".format(latt))}{x+3}, {float("{:.1f}".format(long))}{y+3})'
        else:
            y = 6
            region = f'({float("{:.1f}".format(latt))}{x}, {float("{:.1f}".format(long))}{y}), ({float("{:.1f}".format(latt))}{x+399}, {float("{:.1f}".format(long))}{y}), ({float("{:.1f}".format(latt))}{x}, {float("{:.1f}".format(long))}{y+399}), ({float("{:.1f}".format(latt))}{x+399}, {float("{:.1f}".format(long))}{y+399})'
    else:
        x = 6
        if long_2_dec < 3:
            y = 0
            region = f'({float("{:.1f}".format(latt))}{x}, {float("{:.1f}".format(long))}{y}), ({float("{:.1f}".format(latt))}{x+3}, {float("{:.1f}".format(long))}{y}), ({float("{:.1f}".format(latt))}{x}, {float("{:.1f}".format(long))}{y+3}), ({float("{:.1f}".format(latt))}{x+3}, {float("{:.1f}".format(long))}{y+3})'
        elif long_2_dec < 6:
            y = 3
            region = f'({float("{:.1f}".format(latt))}{x}, {float("{:.1f}".format(long))}{y}), ({float("{:.1f}".format(latt))}{x+3}, {float("{:.1f}".format(long))}{y}), ({float("{:.1f}".format(latt))}{x}, {float("{:.1f}".format(long))}{y+3}), ({float("{:.1f}".format(latt))}{x+3}, {float("{:.1f}".format(long))}{y+3})'
        else:
            y = 6
            region = f'({float("{:.1f}".format(latt))}{x}, {float("{:.1f}".format(long))}{y}), ({float("{:.1f}".format(latt))}{x+399}, {float("{:.1f}".format(long))}{y}), ({float("{:.1f}".format(latt))}{x}, {float("{:.1f}".format(long))}{y+399}), ({float("{:.1f}".format(latt))}{x+399}, {float("{:.1f}".format(long))}{y+399})'
    
    return region
