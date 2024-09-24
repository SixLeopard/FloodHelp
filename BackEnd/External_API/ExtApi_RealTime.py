import requests
import pandas as pd
import numpy as np
import os
import json
import random
from datetime import datetime, timedelta
from geopy.geocoders import Nominatim
from geopy.distance import geodesic
import hashlib

def generate_unique_id(alert: dict) -> str:
        """Generates a unique ID using the components of the alert."""
        alert_str = f"{alert['location']}_{alert['coordinates']}_{alert['risk']}_{alert['certainty']}_{alert['start']}_{alert['end']}"
        return hashlib.md5(alert_str.encode('utf-8')).hexdigest()

def get_real_time_data() -> str:
    """
    Fetches the latest flood conditions for approximately 40 locations using river height data.
    
    This function retrieves sensor metadata and current river height data from an external API, processes the data,
    and classifies each location's flood status (Major, Moderate, Minor, or No Flood) based on pre-determined height thresholds.
    
    The output is returned in JSON format with the following columns:
        - 'location_name': Name of the monitoring location.
        - 'Coordinates': Latitude and Longitude of the location.
        - 'Last Updated': The most recent timestamp of the river height measurement.
        - 'Flood Category': The flood level category for the location (e.g., Major Flood, Moderate Flood, Minor Flood, No Flood).

    Returns:
        str: A JSON string containing the processed flood conditions for each location.
    
    """

    #getting metadata
    response = requests.get("https://data.brisbane.qld.gov.au/api/explore/v2.1/catalog/datasets/telemetry-sensors-rainfall-and-stream-heights-metadata/records?where=sensor_type%20%3D%20'Stream%20Height%20AHD'&limit=100")
    data = response.json()

    #getting data with flood heights
    response2 = requests.get("https://data.brisbane.qld.gov.au/api/explore/v2.1/catalog/datasets/telemetry-sensors-rainfall-and-stream-heights/records?order_by=measured%20DESC&limit=100&offset=0")
    data2 = response2.json()

    #path to text file
    script_dir = os.path.dirname(os.path.realpath(__file__))
    file_path = os.path.join(script_dir, "classification.txt")


    def flood_category(row):
        """
        takes in a row from the database and checks the level of flooding based on river height
        """
        latest_value = pd.to_numeric(row['latest value'][0], errors='coerce')  
        if latest_value > row['Major Flood Height']:
            return 'Major Flood'
        elif latest_value > row['Moderate Flood Height']:
            return 'Moderate Flood'
        elif latest_value > row['Minor Flood Height']:
            return 'Minor Flood'
        else:
            return 'No Flood'
        

       
    def find_stations(file_path):
        """
        reads .txt file to find the flood classifications for each location/station 
        """
        data = []

        with open(file_path, 'r') as file:
            for line in file:
    
                if not line.strip() or line.startswith("Basin") or line.startswith("----"):
                    
                    continue
                
                

                station_no = line[26:34].strip()
                minor = line[79:86].strip()
                moderate = line[94:101].strip()
                major = line[111:119].strip()

                
                data.append({
                    'location_id': station_no,
                    
                    'Minor Flood Height': minor if minor != '-' else None,
                    'Moderate Flood Height': moderate if moderate != '-' else None,
                    'Major Flood Height': major if major != '-' else None
                })

    
        return pd.DataFrame(data)




    #Extracting data from metadata api
    flattened_data = []
    for item in data["results"]:
        flattened_item = {
            'sensor_id': item['sensor_id'],
            'location_id': item['location_id'],
            'location_name': item['location_name'],
            'sensor_type': item['sensor_type'],
            'unit_of_measure': item['unit_of_measure'],
            'latitude': item['latitude'],
            'longitude': item['longitude'],
        }
        flattened_data.append(flattened_item)

    df = pd.DataFrame(flattened_data)
    updated_stations = {} #keys are station names and values are latest river height

    #extracting latest data from database with river heights
    for entry in data2["results"]:
        measured_time = entry.pop('measured')
        

        for i in entry:
            key = i.strip().upper() 
            if key not in updated_stations.keys():
                updated_stations[key] = [entry[i].strip(), measured_time[0:16].replace("T", " / ")]
            else:
                if(entry[i] != '0' and entry[i] != '-' and (updated_stations[key][0] == '0' or updated_stations[key][0] == '-')):
                    updated_stations[key] = [entry[i].strip(), measured_time[0:16].replace("T", " / ")]
        
    #merging metadata and data with river heights
    df['latest value'] = df['sensor_id'].map(updated_stations)
    df_classification = find_stations(file_path) #classifying using text file
    merged_df = pd.merge(df, df_classification, left_on='location_id', right_on='location_id', how='left')
    df = merged_df


    df['Minor Flood Height'] = pd.to_numeric(df['Minor Flood Height'], errors='coerce')
    df['Moderate Flood Height'] = pd.to_numeric(df['Moderate Flood Height'], errors='coerce')
    df['Major Flood Height'] = pd.to_numeric(df['Major Flood Height'], errors='coerce')

    #classifying each location to see level of flooding
    df['Flood Category'] = df.apply(flood_category, axis=1)


    #Simplifying data to make it look cleaner
    df['Coordinates'] = list(zip(df['latitude'], df['longitude']))
    df['Last Updated'] = df['latest value'].apply(lambda x: x[1] if isinstance(x, list) and len(x) > 1 else None)
    organized_df = df[['location_name', 'Coordinates', 'Last Updated', 'Flood Category']]
    organized_df = organized_df[organized_df['location_name'] != 'Oxley Ck at New Beith']
    data_in_json = organized_df.to_json()
    return data_in_json



def get_alerts() -> list:

    """
    Retrieves all flood alerts for Brisbane from the past day using an external weather API.
    
    This function fetches weather data including flood alerts from the WeatherAPI and filters the alerts to include
    only flood warnings with a specific message type ('Alert'). The function returns the filtered list of alerts,
    each formatted as a dictionary with the following keys:
        - 'headline': The title or summary of the alert.
        - 'location': The affected locations for the flood alert.
        - 'risk': The severity of the flood risk (e.g., Minor, Moderate, Severe).
        - 'certainty': The level of certainty associated with the alert.
        - 'start': The start time of the alert.
        - 'end': The end time of the alert.
        - 'id': a unique ID for the alert
    Returns:
        list: A list of flood alerts in JSON format, where each alert is represented as a dictionary.
    """

    api_key = "7fde6684522a487da5092415242508"
    url = "http://api.weatherapi.com/v1/forecast.json"
    params = {
        "key": api_key,
        "q": "Brisbane",
        "alerts" : "yes",
        "days" : "1"
    }


    
    response = requests.get(url, params=params)
    data = response.json()
    list_of_alerts = data["alerts"]["alert"]
    filtered_list_of_alerts = []
    
    for alert in list_of_alerts:
        new_alert = {}
        if (alert["event"] == "Flood Warning" and alert["msgtype"] == "Alert"):
            lat, lon = get_coordinates(f"Brisbane, {alert['areas']}")
            new_alert["id"] = generate_unique_id(alert)
            new_alert["headline"] = alert["headline"]
            new_alert["location"] = alert["areas"]
            new_alert["coordinates"] = (lat, lon)
            new_alert["risk"] = alert["severity"]
            new_alert["certainty"] = alert["certainty"]
            new_alert["start"] = alert["effective"]
            new_alert["end"] = alert["expires"]
            

            filtered_list_of_alerts.append(json.dumps(new_alert))

    return filtered_list_of_alerts



def get_coordinates(location: str) -> tuple:
    geolocator = Nominatim(user_agent="FloodAppUQ")
    location = geolocator.geocode(location)
    
    if location:
        return (location.latitude, location.longitude)
    else:
        return (None, None)

def random_fake_alerts() -> list:
    """
    Generates a list of dummy flood alerts for various locations in Brisbane. The number of alerts is randomly chosen
    between 1 and 3. Each alert is guaranteed to have a unique location. 
    
    Returns:
        list: A list of JSON-formatted strings, where each string represents a flood alert as a dictionary with the keys:
            - 'headline': A string describing the alert.
            - 'location': A string indicating the location of the alert.
            - 'coordinates': A tuple with 'latitude' and 'longitude'.
            - 'risk': A string indicating the severity of the flood risk (Minor, Moderate, Severe, Extreme)
            - 'certainty': A string indicating the certainty level of the alert (Possible, Likely, Observed, Unlikely)
            - 'start': A string with the start time of the alert, in ISO 8601 format. The start time is always going to be the time when this method is called. 
            - 'end': A string with the end time of the alert, in ISO 8601 format. This is the start time + random 1 to 6 hours
            - 'id': a unique ID for the alert
    """

    locations = [
        "Brisbane, Brisbane City", "Brisbane, Fortitude Valley", "Brisbane, Kangaroo Point", "Brisbane, South Bank", "Brisbane, New Farm", 
        "Brisbane, Teneriffe", "Brisbane, Woolloongabba", "Brisbane, Red Hill", "Brisbane, West End", "Brisbane, Toowong", "Brisbane, Paddington"
    ]
    
   
    random.shuffle(locations)
    
    severities = ["Minor", "Moderate", "Severe", "Extreme"]
    
    certainties = ["Possible", "Likely", "Observed", "Unlikely"]

    
    def round_to_nearest_minute(dt: datetime) -> datetime:

        return dt.replace(second=0, microsecond=0) + timedelta(minutes=round(dt.second / 60))

    def get_random_times() -> tuple:

        start_time = datetime.now()
        start_time_rounded = round_to_nearest_minute(start_time)
        end_time = start_time_rounded + timedelta(hours=random.randint(1, 6))
        end_time_rounded = round_to_nearest_minute(end_time)
        return start_time_rounded.isoformat(), end_time_rounded.isoformat()

   
    num_alerts = random.randint(1, 3)
    used_locations = set()
    random_alerts = []
    for i in range(num_alerts):
        
        location_name = None
        for loc in locations:
            if loc not in used_locations:
                location_name = loc
                used_locations.add(loc)
                break
        
        if location_name is None:
            continue
        
        lat, lon = get_coordinates(f"Brisbane, {location_name}")
        start, end = get_random_times()
        severity = random.choice(severities)
        certainty = random.choice(certainties)
        
        
        headline = (f"Flood Warning for {location_name}: "
                    f"Risk Level - {severity}, Certainty - {certainty}. "
                    f"Effective from {start} to {end}.")
        
        alert = {
            "headline": headline,
            "location": location_name,
            "coordinates": (lat, lon),
            "risk": severity,
            "certainty": certainty,
            "start": start,
            "end": end
        }

        random_alerts.append(json.dumps(alert))
    
    return random_alerts



def fake_alert(headline, location, risk, certainty, issue_date, expiry_date) -> str:
    lat, lon = get_coordinates(f"Brisbane, {location}")
    alert = {
        "headline": headline,
        "location": location,
        "coordinates": (lat, lon),
        "risk": risk,
        "certainty": certainty,
        "start": issue_date,
        "end": expiry_date
    }
    alert = json.dumps(alert)
    return alert
    
