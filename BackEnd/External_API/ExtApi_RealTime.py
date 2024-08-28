import requests
import pandas as pd
import numpy as np
import os



def get_real_time_data():

    #getting metadata
    response = requests.get("https://data.brisbane.qld.gov.au/api/explore/v2.1/catalog/datasets/telemetry-sensors-rainfall-and-stream-heights-metadata/records?where=sensor_type%20%3D%20'Stream%20Height%20AHD'&limit=100")
    data = response.json()

    #getting data with flood heights
    response2 = requests.get("https://data.brisbane.qld.gov.au/api/explore/v2.1/catalog/datasets/telemetry-sensors-rainfall-and-stream-heights/records?order_by=measured%20DESC&limit=100&offset=0")
    data2 = response2.json()

    #path to text file
    script_dir = os.path.dirname(os.path.realpath(__file__))
    file_path = os.path.join(script_dir, "classification.txt")


    #takes in a row from the database and checks whether the level of flooding based on river height
    def flood_category(row):
        latest_value = pd.to_numeric(row['latest value'][0], errors='coerce')  
        if latest_value > row['Major Flood Height']:
            return 'Major Flood'
        elif latest_value > row['Moderate Flood Height']:
            return 'Moderate Flood'
        elif latest_value > row['Minor Flood Height']:
            return 'Minor Flood'
        else:
            return 'No Flood'
        

    #reads .txt file to find the flood classifications for each location/station    
    def find_stations(file_path):
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
                if(entry[i] != '0' and entry[i] != '-'):
                    updated_stations[key] = [entry[i].strip(), measured_time[0:16].replace("T", " / ")]
                else: 
                    updated_stations[key] = entry[i].strip()
            else:
                if(entry[i] != '0' and entry[i] != '-' and (updated_stations[key] == '0' or updated_stations[key] == '-')):
                    updated_stations[key] = [entry[i].strip(), measured_time[0:16].replace("T", " / ")]
        
    #merging metadata and data with river heights
    df['latest value'] = df['sensor_id'].map(updated_stations)
    df_classification = find_stations(file_path)
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
    data_in_json = organized_df.to_json()
    return data_in_json
