from flask import Flask, Blueprint, request, make_response, session
import datetime as Time

session_routes = Blueprint("session_routes", __name__)

status = {}

@session_routes.route("/check_in/send",  methods = ['POST'])
def send_checkin_route():
    '''
        updates the current users status

        Form Data:
            status -> what you want your status to be
        
        Return:
            {"added checkin to":receiver, "from":session["username"]}
    '''
    status = request.form.get('status')

    status[session["uid"]] = (status, Time.datetime.now())
    return make_response({"updated status for":session["username"], "Status set to":status},200)


@session_routes.route("/check_in/get_checkins", methods = ['GET'])
def get_checkin_route():
    '''
        get all status for user with relationship

        Form Data:
            Nothing
        
        Return:
            all checkins for the user and there status
            either "Completed" or "Pending"
    '''
    results = make_response({"checkins":False})
    
    return results

@session_routes.route("/check_in/send_push",  methods = ['POST'])
def respond_to_checkins():
    '''
        respond to all pending checkins against you

        Form Data:
            Nothing
        
        Return:
            {"All Checkings Completed":True}
    '''
    for i in checkins[session["username"]]:
        checkins[session["username"]][i] = "Complete"
    return make_response({"All Checkings Completed":True},200)