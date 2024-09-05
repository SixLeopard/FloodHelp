import json
import pandas as pd
import geopandas as gpd
from shapely.geometry import Polygon, MultiPolygon
import matplotlib.pyplot as plt
import matplotlib.colors as colors
import matplotlib.patches as mpatches

def get_historical_data(file_name: str) -> str:
    
    """
    Processes historical flood data from a JSON file and outputs it in a structured JSON format.
    
    This function reads historical flood data (from the Brisbane City Council) in JSON format from the specified file,
    and extracts relevant information for each flood event, including:
        - 'flood_risk': The flood risk level (e.g., High, Medium, Low).
        - 'flood_type': The type of flood (e.g., river, flash).
        - 'coordinates': Geographical coordinates defining the flood region.
        - 'type': The type of geometry representing the flood area (Polygon or MultiPolygon).

    The function does not generate actual geometry objects but extracts and formats the coordinates and geometry type for further use.

    Args:
        file_name (str): The path to the JSON file containing historical flood data.

    Returns:
        str: A JSON string containing the processed flood data, structured as a list of dictionaries where each entry
        contains the flood risk, type, and coordinates of the flood area.
    """

    #Turns coordinates into geometry objects based on type of geometry (polygon/multipolygon)
    def create_geometry(row):
        try:
            coords = row[0]
            geom_type = row[1]
            if not coords:
                return None
            if geom_type == 'Polygon':
                return Polygon(coords[0])
            elif geom_type == 'MultiPolygon':
                return MultiPolygon([Polygon(poly[0]) for poly in coords])
            else:
                return None
        except (ValueError, SyntaxError):
            print(f"Error processing row: {row}")
            return None
        
    with open(file_name, 'r') as file:
        data = json.load(file)

    extracted_data = []
    #extracts data
    for item in data:
        geo_shape = item.get('geo_shape') or {}
        geometry = geo_shape.get('geometry') or {}
        
        row = {
            'flood_risk': item.get('flood_risk', ''),
            'flood_type': item.get('flood_type', ''),
            'coordinates': geometry.get('coordinates', ''),
            'type': geometry.get('type', ''),
            #'geo': create_geometry([geometry.get('coordinates', ''), geometry.get('type', '')])
        }
        extracted_data.append(row)
    df = pd.DataFrame(extracted_data)
    data_in_json = df.to_json()
    return data_in_json

#optional function just to plot the data
def plot_df(df):
    gdf = gpd.GeoDataFrame(df, geometry='geo')
    gdf = gdf.dropna(subset=['geo'])

 
    risk_categories = ['Very Low', 'Low', 'Medium', 'High', 'Very High']
    color_map = plt.colormaps['YlOrRd']  
    norm = colors.BoundaryNorm(range(len(risk_categories) + 1), color_map.N)
    fig, ax = plt.subplots(figsize=(15, 16)) 
    gdf.plot(ax=ax, column='flood_risk', cmap=color_map, norm=norm, legend=False)
    legend_patches = [mpatches.Patch(color=color_map(norm(i)), label=cat) 
                      for i, cat in enumerate(risk_categories)]
    ax.legend(handles=legend_patches, loc='upper center', bbox_to_anchor=(0.5, -0.05),
              ncol=5, title="Flood Risk")

    plt.axis('off')
    plt.tight_layout()
    plt.subplots_adjust(bottom=0.1) 
    plt.show()

