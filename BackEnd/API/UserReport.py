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
        submit new user report
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

@userreport_routes.route("/reporting/user/get_report", methods = ['GET'])
def get_user_report_route():
    '''
    Retrieve the report with the ID specified in the report_id field of the request body
    '''
    if request.method == 'GET':
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
    '''
    if request.method == 'GET':
        if Accounts.verify_user_account(session["username"], session["id"]):
            try:
                return make_response({'reports': str(db.get_all_hazard_details()).strip('[]')})
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
    '''
    if request.method == 'GET':
        if Accounts.verify_user_account(session["username"], session["id"]):
            try:
                return make_response({'reports': str(db.get_all_hazard_coordinates()).strip('[]')})
            except Exception as e:
                return make_response({'internal_error': str(e)})
        return make_response({"invalid_account":1})
    return make_response({"invalid_request":1})

@userreport_routes.route("/reporting/user/get_report_validation_score", methods = ['GET'])
def get_report_validation_score_route():
    '''
        get validation score for specific report
    '''
    if request.method == 'GET':
        report_id = request.form.get('report_id')
        if Accounts.verify_user_account(session["username"], session["id"]):
            return make_response(json.loads('{ "Reports": ' + str(db.get_all_hazard_coordinates()).strip('[]').replace("'", '"').replace("datetime.datetime", '').replace(" (", ' "(').replace("),", ')",') + "}"))
            score = UserReportVerfication.validate_user_reports(json.dumps(db.get_all_hazard_coordinates()), get_user_report(report_id))
            return make_response({report_id:score})
        
        return make_response({"invalid_account":1})
    return make_response({"invalid_request":1})