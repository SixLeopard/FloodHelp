#flask
from flask import Flask, session, make_response,request, Blueprint
import API.Accounts as Accounts
from External_API.ExtApi_RealTime import get_real_time_data
from API.database import database_interface as db

externalData_routes = Blueprint("externalData_routes", __name__)




@externalData_routes.route("/externalData/get_river_conditions", methods = ['GET'])
def get_river_conditions():
    '''
        Gives flood conditions for over 40 river height stations around Brisbane.
        
        Form Data:
            None

        Return:
            if succsessful: json of flood risks for river height stations. Keys are: 'location_name', 'Coordinates', 'Last Updated', and 'Flood Category'.
            no login: {"invalid_account":1}
            not using GET: {"invalid_request":1}
    '''
    if request.method == 'GET':    
        path_to_historical = request.form.get('path')    
        if Accounts.verify_user_account(session["username"], session["id"]):
            uid = session["uid"]
            try:
                river_condtions =  get_real_time_data()
            except Exception as e:
                return make_response({"internal_error": str(e)})

            return make_response(river_condtions)
        return make_response({"invalid_account":1})
    return make_response({"invalid_request":1})