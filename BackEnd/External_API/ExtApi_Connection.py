###############################################
# Description
###############################################
# Compares official flood hazard warnings with 
# user-submitted hazard reports and identifies 
# matches based on proximity.
###############################################
# Setup
###############################################
from geopy.distance import geodesic
from ExtApi_RealTime import get_alerts
from Database.db_interface import DBInterface

from External_API.database import database_interface as db
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

def hazard_matches():

    """
    Compares official flood hazard warnings with user-submitted hazard reports and identifies matches based on proximity.


    Returns:
        dict: A dictionary where the keys are the IDs of official flood hazard warnings and the values 
        are lists of user-submitted reports that are within the specified minimum distance. 
        Each user report is represented as a dictionary with keys:
            - 'id': Unique identifier for the user-submitted report.
            - 'coordinates': A tuple (latitude, longitude) representing the user's report location.
    
    """

    user_reports = db.get_all_hazard_coordinates()
    official_warnings = db.get_alerts()
    min_distance = 1 #in km
    match_list = {}

    for official_warning in official_warnings:
        official_warning_coord = official_warning[7]
        official_warning_id = official_warning[0]
        nearby_user_reports = []

        for user_report in user_reports:
            user_report_coord = user_report['coordinates']
            user_report_id = user_report["hazard_id"]

            distance_difference_km = geodesic(user_report_coord, official_warning_coord).kilometers
            if distance_difference_km < min_distance:
                nearby_user_reports.append(user_report)

        match_list[official_warning_id] = nearby_user_reports
    return match_list


    
