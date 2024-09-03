import requests
import pandas as pd
import numpy as np
import os
import json


def get_real_time_data():

    """
    Gets latest flood conditions for around 40 locations using river height data. Output is in JSON format with following columns: 'location_name', 'Coordinates', 'Last Updated', 'Flood Category'
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

    #removing 32nd row due to problem regarding that specific location (always returning major flood)
    organized_df = organized_df.drop(32)
    organized_df = organized_df.reset_index(drop=True)

    data_in_json = organized_df.to_json()
    return data_in_json



def get_alerts():
    """
    Gets all flood alerts in Brisbane from the past day. Returns a list of dictionaries in JSON format. Each dictionary has the keys: headline, location, risk, certainty, start, end.
    """

    api_key = "7fde6684522a487da5092415242508"
    url = "http://api.weatherapi.com/v1/forecast.json"
    params = {
        "key": api_key,
        "q": "New South Wales",
        "alerts" : "yes",
        "days" : "3"
    }


    response = requests.get(url, params=params)
    data = response.json()
    list_of_alerts = data["alerts"]["alert"]
    filtered_list_of_alerts = []
    for alert in list_of_alerts:
        new_alert = {}
        if (alert["event"] == "Flood Warning" and alert["msgtype"] == "Alert"):

            new_alert["headline"] = alert["headline"]
            new_alert["location"] = alert["areas"]
            new_alert["risk"] = alert["severity"]
            new_alert["certainty"] = alert["certainty"]
            new_alert["start"] = alert["effective"]
            new_alert["end"] = alert["expires"]

            filtered_list_of_alerts.append(json.dumps(new_alert))

    return filtered_list_of_alerts


