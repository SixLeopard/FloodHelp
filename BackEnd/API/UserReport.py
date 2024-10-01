#flask
from flask import Flask, session, make_response,request, Blueprint
import API.Accounts as Accounts
import API.UserReport as Reports
import API.Notifications as Notifcations
from Tools import UserReportVerfication
from Tools import GenerateRegion
import re
from datetime import datetime, timedelta
from apscheduler.schedulers.background import BackgroundScheduler

from API.database import database_interface as db
import json

userreport_routes = Blueprint("userreport_routes", __name__)

# The number of hours after which a user report will be deleted by the hazard_maintenance()
# function.
HAZARD_EXPIRY_HOURS = 48

# The number of hazards which must be reported in a region for a user to be notified
# of a high number of hazards
HAZARD_REPORT_THRESHOLD = 10

# A dictionary that will contain a mapping of each region to the number of hazards
# in that region. Regions are defined by the BackEnd/Tools/generate_region.py:generate_region
# function. They are a tuple of 4 coordinate tuples define the corners of the (square) region
hazard_count_per_region = {}

# A mapping of uid to a timestamp corresponding to the last time a user recieved a notification
# notifying them of a high number of hazards.
last_high_hazard_notification = {}

# Initialise the background scheduler to call the hazard_maintenance() function at
# a specific interval of time
def hazard_maintenance_wrapper():
    hazard_maintenance()
scheduler = BackgroundScheduler()
job = scheduler.add_job(hazard_maintenance_wrapper, 'interval', hours=12)
scheduler.start()

def get_user_report(id):
    return db.get_hazard(id)
    
def create_user_report(uid : int, location : str, type : str, description: str, img_str: str = None):
    '''
        create user report
        location is a string in the form "{LAT},{LONG}"
    '''
    # Extract coordinates from location
    lat, long = map(float, re.findall(r"[-+]?\d*\.\d+|\d+", location))

    try:
        hazard_id = db.create_hazard(type, img_str, session['uid'], (lat, long), description)
        region = GenerateRegion.generate_region((lat, long))
        if region in hazard_count_per_region.keys():
            hazard_count_per_region[region] += 1
        else:
            hazard_count_per_region[region] = 1
        return hazard_id
    except Exception as e:
        return make_response({'internal_error': str(e)})

def delete_user_report(id):
    '''
    Attempts to delete the report with the given ID from the database

    Parameters:
        id (int): The id of the report to be deleted
    
    Returns:
        True: If successful
        False: If hazard does not exist
    '''
    return db.delete_hazard(id)

def hazard_maintenance():
    '''
    This function is intended to be periodically run in order to delete hazards
    after a certain interval of time (HAZARD_EXPIRY_HOURS). This function 
    also decrements the hazard_count_by_region for an deleted hazards.

    Possible feature:
        Send a notification to the user who created the hazard when it is about
        to expire. Provide them the update to renew the report (Set report 
        timestamp to now).
    '''
    hazards = db.get_all_hazard_details()

    for hazard_id in hazards.keys():
        hazard = hazards[hazard_id]
        if (datetime.now() \
            - datetime.strptime(hazard['datetime'], '%d/%m/%y %H:%M:%S')) \
            > timedelta(hours=HAZARD_EXPIRY_HOURS):
            # Delete from database
            db.delete_hazard(hazard_id)

            # If hazard count for that region exists and is greater than 0, then decrement
            coordinates = (float(hazard['coordinates'].split(',')[0].strip('(), ')), \
                           float(hazard['coordinates'].split(',')[1].strip('(), ')))
            region = GenerateRegion.generate_region(coordinates)
            if region in hazard_count_per_region.keys() \
                and hazard_count_per_region[region] > 0:

                hazard_count_per_region[region] -= 1

                # If no more hazards in region, then delete region to save memory
                if hazard_count_per_region[region] == 0:
                    del hazard_count_per_region[region]

def check_hazard_counts(uid: int, coordinates: str) -> None:
    '''
    Check if the number of hazards reported in the region of curr_location exceeds
    the value specified in HAZARD_REPORT_THRESHOLD, and if so, generate a notification
    for the user specied by uid. Note that this notification is generated at most once
    every 24 hours.

    Paramters:
        uid: The uid of the user for which the notification should be generated
        curr_location: The coordinates of the user in the form (x.xxx, y.yyy)
    '''
    coordinates = (float(coordinates.split(',')[0].strip('(), ')), \
                   float(coordinates.split(',')[1].strip('(), ')))

    region = GenerateRegion.generate_region(coordinates)

    if region in Reports.hazard_count_per_region.keys() \
        and Reports.hazard_count_per_region[region] > 10 \
        and (uid not in last_high_hazard_notification.keys() \
             or datetime.now() - last_high_hazard_notification[uid]
             > timedelta(hours=24)):
        Notifcations.add_notification(uid, "There have been a high number of hazards reported in your area")
        last_high_hazard_notification[uid] = datetime.now()

@userreport_routes.route("/reporting/user/add_report", methods = ['POST'])
def add_user_report_route():
    '''
        Submit new user report

        Form Data:
            location -> the location of the user in the form "{LAT},{LONG}"
            hazard_type -> The type or name of the hazard
            description -> textual description of the hazard
            image -> An image assosciated with the hazard

        Returns:
            if successful: {hazard_id, hazard_type, datetime, reporting_uid, area_name, coordinates, img}
            error 1: {'internal_error': error_description}
            no login: {"invalid_account":1}
            not using POST: {"invalid_request":1}
    '''
    if request.method == 'POST':
        location = request.form.get('location')
        hazard_type = request.form.get('type')
        description = request.form.get('description')
        img = request.form.get('image')
        if Accounts.verify_user_account(session["username"], session["id"]):
            try:
                report_id = create_user_report(session["uid"],location,hazard_type,description, img)
                return make_response(get_user_report(report_id))
            except Exception as e:
                return make_response({'internal_error': str(e)})
        return make_response({"invalid_account":1})
    return make_response({"invalid_request":1})

@userreport_routes.route("/reporting/user/get_report", methods = ['POST'])
def get_user_report_route():
    '''
    Retrieve the report with the ID specified in the report_id field of the request body

    Form Data:
        report_id: The numerical ID of the report to retrieve

    Returns:
        if successful: {hazard_id: {hazard_type, datetime, reporting_uid, area_name, coordinates, img}, ...}
        error 1: {'internal_error': error_description}
        no login: {"invalid_account":1}
        not using POST: {"invalid_request":1}
    '''
    if request.method == 'POST':
        report_id = request.form.get('report_id')
        if Accounts.verify_user_account(session["username"], session["id"]):
            try:
                report = get_user_report(report_id)
            except Exception as e:
                return make_response({'internal_error': str(e)})
            if report is None:
                return make_response({"report_not_found": 1})
            return make_response(report)
        return make_response({"invalid_account":1})
    return make_response({"invalid_request":1})

@userreport_routes.route("/reporting/user/get_all_report_details", methods = ['GET'])
def get_all_report_details_route():
    '''
    Retrieve all reports made by all users including all details

    Form data:
        None

    Returns:
        if successful: {hazard_id: {hazard_type, datetime, reporting_uid, area_name, coordinates, img}, ...}
        error 1: {'internal_error': error_description}
        no login: {"invalid_account":1}
        not using POST: {"invalid_request":1}
    '''
    if request.method == 'GET':
        if Accounts.verify_user_account(session["username"], session["id"]):
            try:
                return make_response(db.get_all_hazard_details())
            except Exception as e:
                return make_response({'internal_error': str(e)})
        return make_response({"invalid_account":1})
    return make_response({"invalid_request":1})

@userreport_routes.route("/reporting/user/get_all_report_basic", methods = ['GET'])
def get_all_report_coordinates_route():
    '''
    Retrieve all reports made by all users but only include some details.
    Details included are:
        - hazard_id
        - datetime
        - title
        - coordinates

    Form data:
        None

    Returns:
        if successful: {hazard_id, hazard_type, datetime, coordinates}
        error 1: {'internal_error': error_description}
        no login: {"invalid_account":1}
        not using POST: {"invalid_request":1}
    '''
    if request.method == 'GET':
        if Accounts.verify_user_account(session["username"], session["id"]):
            try:
                return make_response(db.get_all_hazard_coordinates())
            except Exception as e:
                return make_response({'internal_error': str(e)})
        return make_response({"invalid_account":1})
    return make_response({"invalid_request":1})

@userreport_routes.route("/reporting/user/get_all_reports_by_user", methods = ['GET'])
def get_all_reports_by_user():
    '''
    Retrieve all reports made by the current user including all detials.
    Returns a nested JSON string where the key is the report ID of each report
    and the value is the details of the report

    Form data:
        None

    Returns:
        if successful: {hazard_id: {hazard_type, datetime, reporting_uid, area_name, coordinates, img}, ...}
        error 1: {'internal_error': error_description}
        no login: {"invalid_account":1}
        not using POST: {"invalid_request":1}
    '''
    if request.method == 'GET':
        if Accounts.verify_user_account(session["username"], session["id"]):
            try:
                return make_response(db.get_all_reports_by_user(session['uid']))
            except Exception as e:
                return make_response({'internal_error': str(e)})
        return make_response({"invalid_account":1})
    return make_response({"invalid_request":1})

@userreport_routes.route("/reporting/user/get_report_validation_score", methods = ['POST'])
def get_report_validation_score_route():
    '''
        get validation score for specific report

        Form Data:
            report_id: the report id to get the validation score for

        Returns:
            {report_id:score} where score gives the score number then a list of
            of all the hazrd ids that contributeed to that score
    '''
    if request.method == 'POST':
        report_id = request.form.get('report_id')
        if Accounts.verify_user_account(session["username"], session["id"]):
            score = UserReportVerfication.validate_user_reports(db.get_all_hazard_ranking_dict(), get_user_report(report_id))
            return make_response({report_id:score})
        
        return make_response({"invalid_account":1})
    return make_response({"invalid_request":1})
