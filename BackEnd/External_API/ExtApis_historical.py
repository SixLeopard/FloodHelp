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
from Tools import CoordString_to_Tuple

from External_API.database import database_interface as db
# Sample method to check if a point is inside a polygon or multipolygon
def is_point_in_polygon_or_multipolygon(type, geometry_coords, point_coord):

    # Determine if we have a MultiPolygon or a Polygon based on the input structure
    if (type == "MultiPolygon") :  # Checks if we have multiple polygons (MultiPolygon)
        # Create a MultiPolygon object
        polygons = [Polygon(coords) for coords in geometry_coords]
        geometry = MultiPolygon(polygons)
    else:
        # Create a Polygon object if it's a simple Polygon
        geometry = Polygon(geometry_coords)
    
    point = Point(point_coord)
    
    # Check if the point is within the polygon or multipolygon
    return geometry.contains(point)


def check_point(point: tuple):
    historical = db.get_historical_data()

    for row in historical:
        coords = row[2]
        type = row[3]

        coords = coords[1:-1]
        type = type[1:-1]
        coords = ast.literal_eval(coords)

        if (is_point_in_polygon_or_multipolygon(type, coords, point)):
            return row
    
    return None



#-27.499547, 153.016861



