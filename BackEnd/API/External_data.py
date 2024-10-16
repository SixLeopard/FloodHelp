#flask
from flask import Flask, session, make_response,request, Blueprint
import API.Accounts as Accounts

import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from External_API.ExtApi_RealTime import get_real_time_data
from External_API.ExtApis_historical import check_point
from API.database import database_interface as db

externalData_routes = Blueprint("externalData_routes", __name__)




@externalData_routes.route("/externalData/get_polygon", methods = ['POST'])
def get_polygon():
    '''
        Gets the corresponding polygon that a coordinate is in.
        
        Form Data:
            Coordinate (example: (153.016861, -27.499547))

        Return:
            if succsessful: Returns the database row (tuple) where the point is contained within the polygon or multipolygon. 
            Returns `None` if the point is not found within any polygon or multipolygon.
            no login: {"invalid_account":1}
            not using GET: {"invalid_request":1}
    '''
    if request.method == 'POST':    
        coordinate = request.form.get('coordinate')    
        if Accounts.verify_user_account(session["username"], session["id"]):
            try:
                polygon =  check_point(coordinate)
            except Exception as e:
                return make_response({"internal_error": str(e)})

            return make_response(polygon)
        return make_response({"invalid_account":1})
    return make_response({"invalid_request":1})




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
        if Accounts.verify_user_account(session["username"], session["id"]):
            try:
                river_condtions =  get_real_time_data()
            except Exception as e:
                return make_response({"internal_error": str(e)})

            return make_response(river_condtions)
        return make_response({"invalid_account":1})
    return make_response({"invalid_request":1})


@externalData_routes.route("/externalData/get_alerts", methods = ['GET'])
def get_alerts():
    '''
        Retrieves all flood alerts in the database
        
        Form Data:
            None

        Return:
            if succsessful: list of tuples, which are the alert. Looks like: [('headline', 'location', 'risk', 'certainty', 'start', 'end', 'coordinates'), ...] 
            no login: {"invalid_account":1}
            not using GET: {"invalid_request":1}
    '''
    if request.method == 'GET':      
        if Accounts.verify_user_account(session["username"], session["id"]):
            try:
                alerts =  db.get_alerts()
            except Exception as e:
                return make_response({"internal_error": str(e)})

            return make_response(alerts)
        return make_response({"invalid_account":1})
    return make_response({"invalid_request":1})



@externalData_routes.route("/externalData/clear_expired_alerts", methods = ['POST'])
def clear_expired_alerts():
    '''
        Clears all expired alerts in the database
        
        Form Data:
            None

        Return:
            if succsessful: None
            no login: {"invalid_account":1}
            not using GET: {"invalid_request":1}
    '''
    if request.method == 'POST':      
        if Accounts.verify_user_account(session["username"], session["id"]):
            try:
                db.delete_expired_alerts()
            except Exception as e:
                return make_response({"internal_error": str(e)})

            return None
        return make_response({"invalid_account":1})
    return make_response({"invalid_request":1})



@externalData_routes.route("/externalData/update_real_alerts", methods = ['POST'])
def update_real_alerts():
    '''
        Updates the database with real alerts
        Don't call too many times in a short period of time (3-5 min)

        Form Data:
            None

        Return:
            if succsessful: None
            no login: {"invalid_account":1}
            not using GET: {"invalid_request":1}
    '''
    if request.method == 'POST':      
        if Accounts.verify_user_account(session["username"], session["id"]):
            try:
                db.update_alerts_real()
            except Exception as e:
                return make_response({"internal_error": str(e)})

            return None
        return make_response({"invalid_account":1})
    return make_response({"invalid_request":1})



@externalData_routes.route("/externalData/update_fake_random_alerts", methods = ['POST'])
def update_fake_random_alerts():
    '''
        Updates the database with 1-3 random fake alerts
        Don't call too many times in a short period of time (3-5 min)

        Form Data:
            None

        Return:
            if succsessful: None
            no login: {"invalid_account":1}
            not using GET: {"invalid_request":1}
    '''
    if request.method == 'POST':      
        if Accounts.verify_user_account(session["username"], session["id"]):
            try:
                db.update_alerts_fake_random()
            except Exception as e:
                return make_response({"internal_error": str(e)})

            return None
        return make_response({"invalid_account":1})
    return make_response({"invalid_request":1})



@externalData_routes.route("/externalData/update_fake_specific_alerts", methods = ['POST'])
def update_fake_specific_alerts():
    '''
        Add one custom fake alert to database
        Don't call too many times in a short period of time (3-5 min)

        If you want to specify exact coordinates of alert, put in the coordinates that you want in "coordinates" argument. If you want to just provide a location
        without specifying exact coordinates, input (0,0) into the "coordinates" argument.
        
        Form Data:
            'headline': general headline
            'location': area in which alert is in
            'risk': risk level of alert
            'certainty': certainty of alert
            'start': issue date of alert
            'end': expiry date of alert
            'coordinates': exact coordinates of alert, in the form of a tuple

        Return:
            if succsessful: None
            no login: {"invalid_account":1}
            not using GET: {"invalid_request":1}
    '''
    if request.method == 'POST':  
        headline = request.form.get('headline')    
        location = request.form.get('location')   
        risk = request.form.get('risk')
        certainty = request.form.get('certainty')
        start = request.form.get('start')
        end = request.form.get('end')
        coordinates = request.form.get('coordinates')



        if Accounts.verify_user_account(session["username"], session["id"]):
            try:
                db.update_alerts_fake_specific(headline, location, risk, certainty, start, end, coordinates)
            except Exception as e:
                return make_response({"internal_error": str(e)})

            return None
        return make_response({"invalid_account":1})
    return make_response({"invalid_request":1})



@externalData_routes.route("/externalData/clear_alerts", methods = ['POST'])
def clear_alerts():
    '''
        Clears all alerts in the database
        
        Form Data:
            None

        Return:
            if succsessful: None
            no login: {"invalid_account":1}
            not using GET: {"invalid_request":1}
    '''
    if request.method == 'POST':  

        if Accounts.verify_user_account(session["username"], session["id"]):
            try:
                db.delete_all_alerts()
            except Exception as e:
                return make_response({"internal_error": str(e)})

            return None
        return make_response({"invalid_account":1})
    return make_response({"invalid_request":1})

@externalData_routes.route("/externalData/get_historical_data", methods = ['GET'])
def get_historical_data():
    '''
        Gives historical data
        
        Form Data:
            None

        Return:
            if succsessful: list of tuples: [(risk, coordinates, type),]
            no login: {"invalid_account":1}
            not using GET: {"invalid_request":1}
    '''
    if request.method == 'GET':      
        if Accounts.verify_user_account(session["username"], session["id"]):
            try:
                historical_data =  db.get_historical_data()
            except Exception as e:
                return make_response({"internal_error": str(e)})

            return make_response(historical_data)
        return make_response({"invalid_account":1})
    return make_response({"invalid_request":1})
