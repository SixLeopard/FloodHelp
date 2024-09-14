from flask import Flask, Blueprint, request, make_response, session
import datetime as Time

session_routes = Blueprint("session_routes", __name__)

checkins = {}

@session_routes.route("/check_in/send",  methods = ['POST'])
def send_checkin_route():
    '''
        send a checkin to a user
    '''
    receiver = request.form.get('receiver')
    checkins[receiver][session["username"]] = {"status": "pending", "timestamp": str(Time.datetime.now())}
    return make_response({"added checkin to":receiver, "from":session["username"]},200)


@session_routes.route("/check_in/get_checkins", methods = ['GET'])
def get_checkin_route():
    '''
        get all check_ins and removes complete ones
    '''
    results = make_response({"checkins":False})
    #if user has any checkins
    if session["username"] in checkins:
        #make response
        results = make_response(checkins[session["username"]],200)
        #for every entry pending for the user remove there complete checkins
        for i in checkins[session["username"]]:
            if checkins[session["username"]][i]["status"] == "Complete":
                checkins[session["username"]].pop(i)
    return results

@session_routes.route("/check_in/respond",  methods = ['POST'])
def respond_to_checkins():
    '''
        respond to all pending checkins against you
    '''
    for i in checkins[session["username"]]:
        checkins[session["username"]][i] = "Complete"
    receiver = request.form.get('receiver')
    checkins[receiver][session["username"]]["status"] = "Pending"
    return make_response({"added checkin to":receiver, "from":session["username"]},200)