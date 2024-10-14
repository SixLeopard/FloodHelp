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
# Sample method to check if a point is inside a polygon or multipolygon
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


def check_point(point: tuple):
    i = 1
    historical = db.get_historical_data()

    for row in historical:
        coords = row[2]
        geo_type = row[3]
        print(coords)
        # Attempt to parse
        try:
            coords = coords[1:-1]
            geo_type = geo_type[1:-1]
            coords = ast.literal_eval(coords)
            coords = list(coords)
            if (i == 1):
                i = i + 1
            if (is_point_in_polygon_or_multipolygon(geo_type, coords, point)):
                return row
        except SyntaxError as e:
            k = 0
    
    return None





def check_point_test(point: tuple):
    with open("C:/Users/msi/Desktop/filtered_data.json", 'r') as file:
        data = json.load(file)

    for row in data:
        coords = str(row["coordinates"])
        type = str(row["type"])

        coords = "'" + str(coords) + "'"
        type = "'" + str(type) + "'"

        coords = coords[1:-1]
        type = type[1:-1]
        # Attempt to parse
        try:
            coords = ast.literal_eval(coords)
            print(coords)
            print(type)
            break
            if (is_point_in_polygon_or_multipolygon(type, coords, point)):
                return row
        except SyntaxError as e:
            k = 0
    return None










#-27.499547, 153.016861


#(153.016861, -27.499547)
# Example point
#point = (153.016861, -27.499547)

#print(check_point_test(point))

# Test for polygon
#print(is_point_in_polygon_or_multipolygon('polygon', polygon_coords, point))

# Test for multipolygon
#print(is_point_in_polygon_or_multipolygon('multipolygon', multipolygon_coords, point))


# Define your polygon coordinates (as per your example)


#polygon_coords = [[[152.9945376605, -27.3697088519], [152.9945174357, -27.3697088511], [152.9945174366, -27.3696907948], [152.9945376613, -27.3696907956], [152.9945376605, -27.3697088519]]]

# Create the polygon with Shapely
#polygon = Polygon(polygon_coords[0])
#print("Polygon created:", polygon)

# Test point
#test_point = (152.99452, -27.36970)  # Adjust as needed for testing
#point = Point(test_point)
#print("Point created:", point)

# Check if the point is inside the polygon
#is_contained = polygon.contains(point)
#print("Is the point inside the polygon?", is_contained)