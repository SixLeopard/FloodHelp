#flask
from flask import Flask, session, make_response,request, Blueprint
import API.Accounts as Accounts
from External_API.ExtApis_historical import get_historical_data
from API.database import database_interface as db

externalData_routes = Blueprint("externalData_routes", __name__)




@externalData_routes.route("/externalData/get_historical", methods = ['GET'])
def get_historical():
    '''
        Extracts historical data
        
        Form Data:
            Path to file with historical data

        Return:
            if succsessful: json of extracted historical data
            no login: {"invalid_account":1}
            not using GET: {"invalid_request":1}
    '''
    if request.method == 'GET':    
        path_to_historical = request.form.get('path')    
        if Accounts.verify_user_account(session["username"], session["id"]):
            uid = session["uid"]
            try:
                historical_data =  get_historical_data(path_to_historical)
            except Exception as e:
                return make_response({"internal_error": str(e)})

            return make_response(historical_data)
        return make_response({"invalid_account":1})
    return make_response({"invalid_request":1})