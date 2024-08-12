import requests
from geopy.geocoders import Nominatim
import pandas as pd


#function that takes lon and lat, gives back suburb and street
def get_location_name(latitude, longitude):
    geolocator = Nominatim(user_agent="FloodApplicationUQ")
    location = geolocator.reverse((latitude, longitude), exactly_one=True)
    
    if location:
        
        address = location.raw['address']
        road = address.get('road', '')      
        suburb = address.get('suburb', '')  
        city = address.get('city', '')      
        return f"{road}, {suburb or city}"
    else:
        return "Location not found"
    


#Getting data
response = requests.get('https://data.brisbane.qld.gov.au/api/explore/v2.1/catalog/datasets/flood-awareness-flood-risk-overall/records?limit=20')
data = response.json()
data_list = []

#Extracting from the data useful information (lon, lat, flood type, flood risk)
for result in data['results']:
    keys = list(result.keys())  
    risk = result[keys[1]]
    type = result[keys[2]]
    if (result[keys[-1]]) is not None:
        new_keys = list((result[keys[-1]]).keys())
        lon = (result[keys[-1]])[new_keys[0]]
        lat = (result[keys[-1]])[new_keys[1]]
        location_name = get_location_name(lat, lon)

        data_list.append({
            'location_name': location_name,
            'type': type,
            'risk': risk
        })



df = pd.DataFrame(data_list)
print(df)
