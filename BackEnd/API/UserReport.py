#flask
from flask import Flask, session, make_response,request, Blueprint
import API.Login as Login
import uuid

userreport_routes = Blueprint("userreport_routes", __name__)

user_reports = {}

@userreport_routes.route("/reporting/user/add_report", methods = ['POST'])
def add_user_report():
    '''
        submit new user report
    '''
    if request.method == 'POST':
        location = request.form.get('location')
        hazard_type = request.form.get('type')
        description = request.form.get('description')
        if Login.verify_user_account(session["username"], session["id"]):
            report_id = str(uuid.uuid4())
            user_reports[report_id] = {"User": session["username"], "report_id":report_id, "location":location, "type":hazard_type, "description":description}

            return make_response(user_reports[report_id])
        
        return make_response({"invalid_account":1})
    
    return make_response({"invalid_request":1})

@userreport_routes.route("/reporting/user/get_report", methods = ['GET'])
def get_user_report():
    '''
        get specific user report
    '''
    if request.method == 'GET':
        report_id = request.form.get('report_id')
        if Login.verify_user_account(session["username"], session["id"]):
            try:
                return make_response(user_reports[report_id])
            except:
                return make_response({"invalid_report_id":1})
        
        return make_response({"invalid_account":1})
    
    return make_response({"invalid_request":1})

@userreport_routes.route("/reporting/user/get_all_report", methods = ['GET'])
def get_all_user_report():
    '''
        get specific user report
    '''
    if request.method == 'GET':
        if Login.verify_user_account(session["username"], session["id"]):
            return make_response(user_reports)
        
        return make_response({"invalid_account":1})
    
    return make_response({"invalid_request":1})