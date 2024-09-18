from geopy.distance import geodesic
from ExtApi_RealTime import get_alerts
from Database.db_interface import DBInterface

db = DBInterface()

def hazard_matches():

    user_reports = db.get_all_hazard_coordinates()
    official_warnings = get_alerts()
    min_distance = 1 #in km
    match_list = {}

    for official_warning in official_warnings:
        official_warning_coord = official_warning["coordinates"]
        official_warning_id = official_warning["id"]
        nearby_user_reports = []

        for user_report in user_reports:
            user_report_coord = user_report["coordinates"]
            user_report_id = user_report["id"]

            distance_difference_km = geodesic(user_report_coord, official_warning_coord).kilometers
            if distance_difference_km < min_distance:
                nearby_user_reports.append(user_report)

        match_list[official_warning_id] = nearby_user_reports


    