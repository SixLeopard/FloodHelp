from flask import Flask, Blueprint, request, make_response, session
import datetime as Time
from API.database import database_interface
import API.Accounts as Accounts
from API.Notifications import add_notification

checkin_routes = Blueprint("session_routes", __name__)

status = {}

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

            status[session["uid"]] = (status, Time.datetime.now())

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
                if status[i][1] < Time.datetime.now() - Time.timedelta(hours=3):
                    status[i] = ("Unknown", Time.datetime.now())
                output[database_interface.get_user_by_uid(int(i))[2]] = status[i]
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

            add_notification(reciever, f"{session["uid"]} as requested you to update your status")
            return make_response({"added piush notfication to":reciever, "from":session["uid"]},200)
        
        return make_response({"invalid_account":1})
    return make_response({"invalid_request":1})