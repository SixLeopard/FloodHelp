import requests
from geopy.geocoders import Nominatim
import pandas as pd
import matplotlib.pyplot as plt
import geopandas as gpd
from shapely.geometry import Polygon, MultiPolygon



#Takes in multipolygon (4d array of coordinates) and plots it 
def plot_multipolygon(coordinates):
    polygons = []
    
    for polygon_coords in coordinates:
        outer_ring = [(lon, lat) for lon, lat in polygon_coords[0]]
        inner_rings = [
            [(lon, lat) for lon, lat in ring] for ring in polygon_coords[1:]
        ]
        polygons.append(Polygon(outer_ring, inner_rings))
    multipolygon = MultiPolygon(polygons)
    gdf = gpd.GeoDataFrame(geometry=[multipolygon])
    gdf.plot()
    
    plt.title("MultiPolygon Visualization")
    plt.xlabel("Longitude")
    plt.ylabel("Latitude")
    plt.show()
    


#Getting data
response = requests.get('https://data.brisbane.qld.gov.au/api/explore/v2.1/catalog/datasets/flood-awareness-flood-risk-overall/records?select=flood_risk%2C%20flood_type%2C%20shape_area%2C%20geo_shape&where=geo_shape%20IS%20NOT%20NULL&order_by=shape_area%20DESC&limit=100')
data = response.json()
data_list = []

#Extracting from the data useful information (multipolygon, flood type, flood risk)
for result in data['results']:
    keys = list(result.keys())  
    risk = result[keys[0]]
    type = result[keys[1]]
    location = result[keys[3]]
    location_keys = list(location.keys())
    geometry = location[location_keys[1]]
    geometry_keys = list(location[location_keys[1]].keys())
    if geometry[geometry_keys[1]] == "MultiPolygon":
        multipolygon= geometry[geometry_keys[0]]
        data_list.append({
        "map_area": multipolygon,
        'type': type,
        'risk': risk
        })

df = pd.DataFrame(data_list)
print(df)
