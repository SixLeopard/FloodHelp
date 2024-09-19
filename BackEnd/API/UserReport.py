#flask
from flask import Flask, session, make_response,request, Blueprint
import API.Accounts as Accounts
from Tools import UserReportVerfication
import re

from API.database import database_interface as db
import json

userreport_routes = Blueprint("userreport_routes", __name__)

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
        return db.create_hazard(type, img_str, session['uid'], (lat, long), description)
    except Exception as e:
        return make_response({'internal_error': str(e)})

@userreport_routes.route("/reporting/user/add_report", methods = ['POST'])
def add_user_report_route():
    '''
        Submit new user report

        Form Data:
            location -> the location of the user in the form "{LAT},{LONG}"
            hazard_type -> The type or name of the hazard
            description -> textual description of the hazard
            img -> An image assosciated with the hazard

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
        if successful: {hazard_id, hazard_type, datetime, reporting_uid, area_name, coordinates, img}
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
        if successful: {hazard_id, hazard_type, datetime, reporting_uid, area_name, coordinates, img}
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
    '''
    if request.method == 'POST':
        report_id = request.form.get('report_id')
        if Accounts.verify_user_account(session["username"], session["id"]):
            score = UserReportVerfication.validate_user_reports(db.get_all_hazard_ranking_dict(), get_user_report(report_id))
            return make_response({report_id:score})
        
        return make_response({"invalid_account":1})
    return make_response({"invalid_request":1})
