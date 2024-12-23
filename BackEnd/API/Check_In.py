###############################################
# Description
###############################################
# Route for API that contains all the check in
# related routes and supporting functions
###############################################
# Setup
###############################################
from flask import Flask, Blueprint, request, make_response, session
import datetime as Time
from API.database import database_interface
import API.Accounts as Accounts
from API.Notifications import add_notification

checkin_routes = Blueprint("checkin_routes", __name__)
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

statuses = {}

status_timeout_hours = 3

@checkin_routes.route("/check_in/send",  methods = ['POST'])
def send_checkin_route():
    '''
        updates the current users status

        Form Data:
            status -> what you want your status to be
        
        Return:
            {"added checkin to":receiver, "from":session["username"]}
    '''
    if request.method == 'POST':
        status = request.form.get('status')
        if Accounts.verify_user_account(session["username"], session["id"]):

            statuses[str(session["uid"])] = (status, Time.datetime.now())

            return make_response({"updated status for":session["username"], "Status set to":status},200)
        
        return make_response({"invalid_account":1})
    return make_response({"invalid_request":1})


@checkin_routes.route("/check_in/get_checkins", methods = ['GET'])
def get_checkin_route():
    '''
        get all status for users that the requester has a relationship with

        Form Data:
            Nothing
        
        Return:
            all checkins for the user and there status
            either "Completed" , "Pending", "Unknown" or "Unsafe"
    '''
    if request.method == 'GET':
        if Accounts.verify_user_account(session["username"], session["id"]):
            relationships = database_interface.get_approved_relationships_ids(session["uid"])
            output = {}
            for i in relationships:
                if (str(i) in statuses):
                    if statuses[str(i)][1] < Time.datetime.now() - Time.timedelta(hours=status_timeout_hours):
                        statuses[i] = ("Unknown", Time.datetime.now())
                    output[str(i)] = (statuses[str(i)], database_interface.get_user_by_uid(int(i))[1])
            results = make_response(output)
            return results
        return make_response({"invalid_account":1})
    return make_response({"invalid_request":1})

@checkin_routes.route("/check_in/get_my_status", methods = ['GET'])
def get_my_checkin_route():
    '''
        get your current status

        Form Data:
            Nothing
        
        Return:
            yourcurrent checkin status
            either "Completed" , "Pending", "Unknown" or "Unsafe"
    '''
    if request.method == 'GET':
        if Accounts.verify_user_account(session["username"], session["id"]):
            relationships = database_interface.get_approved_relationships_ids(session["uid"])
            output = {}
            i = session["uid"]
            if (str(i) in statuses):
                if statuses[str(i)][1] < Time.datetime.now() - Time.timedelta(hours=status_timeout_hours):
                    statuses[i] = ("Unknown", Time.datetime.now())
                output["status"] = statuses[str(i)][0]
                output["time"] = statuses[str(i)][1]
            else:
                return make_response({"you have not given a status yet":1})
            results = make_response(output)
            return results
        return make_response({"invalid_account":1})
    return make_response({"invalid_request":1})

@checkin_routes.route("/check_in/send_push",  methods = ['POST'])
def send_checkin_push_route():
    '''
        respond to all pending checkins against you

        Form Data:
            reciever -> the uid of the user you want to send the checkin push to 
        
        Return:
            {"added piush notfication to":{reciever uid}, "from":{current user uid}}
    '''
    if request.method == 'POST':
        reciever = request.form.get('reciever')
        if Accounts.verify_user_account(session["username"], session["id"]):

            add_notification(reciever, f"{session['uid']} has requested you to update your status")
            return make_response({"added push notfication to":reciever, "from":session["uid"]},200)
        
        return make_response({"invalid_account":1})
    return make_response({"invalid_request":1})
