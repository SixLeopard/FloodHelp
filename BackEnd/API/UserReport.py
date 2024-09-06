#flask
from flask import Flask, session, make_response,request, Blueprint
import API.Accounts as Accounts
import uuid
from Tools import UserReportVerfication

userreport_routes = Blueprint("userreport_routes", __name__)

user_reports = {}

def get_user_report(id = None):
    if id != None:
        return user_reports[id]
    else:
        return user_reports
    
def create_user_report(user : str, location : str, type : str, description: str):
    '''
        create user report
        location is a string in the form "{LAT},{LONG}"
    '''
    report_id = str(uuid.uuid4())
    user_reports[report_id] = {"User": user, "report_id":report_id, "location":location, "type":type, "description":description}
    return report_id


@userreport_routes.route("/reporting/user/add_report", methods = ['POST'])
def add_user_report_route():
    '''
        submit new user report
    '''
    if request.method == 'POST':
        location = request.form.get('location')
        hazard_type = request.form.get('type')
        description = request.form.get('description')
        if Accounts.verify_user_account(session["username"], session["id"]):
            report_id = create_user_report(session["username"],location,hazard_type,description)

            return make_response(get_user_report(report_id))
        
        return make_response({"invalid_account":1})
    
    return make_response({"invalid_request":1})

@userreport_routes.route("/reporting/user/get_report", methods = ['GET'])
def get_user_report_route():
    '''
        get specific user report
    '''
    if request.method == 'GET':
        report_id = request.form.get('report_id')
        if Accounts.verify_user_account(session["username"], session["id"]):
            try:
                if not isinstance(get_user_report(report_id)["location"], tuple):
                    get_user_report(report_id)["location"] = tuple(map(float, get_user_report(report_id)["location"].split(',')))
                return make_response(get_user_report(report_id))
            except:
                return make_response({"invalid_report_id":1})
        
        return make_response({"invalid_account":1})
    
    return make_response({"invalid_request":1})

@userreport_routes.route("/reporting/user/get_all_report", methods = ['GET'])
def get_all_user_report_route():
    '''
        get specific user report
    '''
    if request.method == 'GET':
        if Accounts.verify_user_account(session["username"], session["id"]):
            for i in get_user_report():
                if not isinstance(get_user_report(i)["location"], tuple):
                    get_user_report(i)["location"] = tuple(map(float, get_user_report(i)["location"].split(',')))
            return make_response(get_user_report())
        
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
            score = UserReportVerfication.validate_user_reports(get_user_report(), get_user_report(report_id))
            return make_response({report_id:score})
        
        return make_response({"invalid_account":1})
    
    return make_response({"invalid_request":1})