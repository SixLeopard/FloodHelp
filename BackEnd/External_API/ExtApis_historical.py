###############################################
# Description
###############################################
# api to process hsitorical flooding data
# including what areas were flooded in previous
# floods
###############################################
# Setup
###############################################
import json
import pandas as pd
import geopandas as gpd
from shapely.geometry import Point, Polygon, MultiPolygon
import matplotlib.pyplot as plt
import matplotlib.colors as colors
import matplotlib.patches as mpatches
import os
import json
import pandas as pd
import os
from shapely.geometry import shape, Polygon, MultiPolygon, LineString
import ast
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from External_API.database import database_interface as db
from Tools.CoordString_to_Tuple import convert
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


def is_point_in_polygon_or_multipolygon(geometry_type, geometry_coords, point):
    """
    Check if a point is within a polygon or multipolygon, handling 3D nested list structures.

    Parameters:
    - geometry_type: string indicating 'polygon' or 'multipolygon'.
    - geometry_coords: 3D nested list of coordinates representing polygons or multipolygons.
    - point: tuple representing the point (latitude, longitude).

    Returns:
    - True if the point is inside the polygon/multipolygon, otherwise False.
    """
    # Create the point geometry
    point = Point(point)

    if geometry_type == 'MultiPolygon':
        # Create a MultiPolygon, handling each polygon with possible holes
        polygons = []
        for rings in geometry_coords:
            exterior = rings[0]
            holes = rings[1:] if len(rings) > 1 else []
            polygons.append(Polygon(exterior, holes))
        multipolygon = MultiPolygon(polygons)
        return multipolygon.contains(point)
    
    elif geometry_type == 'Polygon':
        # Single polygon with possible holes
        exterior = geometry_coords[0]
        holes = geometry_coords[1:] if len(geometry_coords) > 1 else []
        polygon = Polygon(exterior, holes)
        return polygon.contains(point)
    
    else:
        raise ValueError("Invalid geometry type: must be 'polygon' or 'multipolygon'")


def check_point(point):
    """
    Check if a given point is inside any polygon or multipolygon in the historical data.

    Parameters:
    - point (string): A tuple representing the point to be checked, in the format (longitude, latitude).

    Returns:
    - tuple or None: Returns the database row (tuple) where the point is contained within the polygon or multipolygon. 
      Returns `None` if the point is not found within any polygon or multipolygon.

    """
    historical = db.get_historical_data()
    point = (float(point.split(',')[0].strip('(), ')), \
                   float(point.split(',')[1].strip('(), ')))
    
    for row in historical:
        coords = row[2]
        geo_type = row[3]
        geo_type = geo_type[1:-1]
        # Attempt to parse
        try:
            coords = ast.literal_eval(coords)
            coords = list(coords)

            if (is_point_in_polygon_or_multipolygon(geo_type, coords, point)):
                # Convert row tuple to dictionary before returning
                row_dict = {
                    "id": row[0],
                    "risk": row[1],
                    "coordinates": row[2],
                    "geo_type": row[3],
                    # Add additional row fields here if applicable
                }
                return json.dumps(row_dict)
        except SyntaxError as e:
            k = 0
    
    return "Nothing Found"




