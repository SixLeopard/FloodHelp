#flask
from flask import Flask, session, make_response,request, Blueprint
import API.Accounts as Accounts

from API.Database.db_interface import DBInterface

relationships_routes = Blueprint("relationships_routes", __name__)

db = DBInterface()

@relationships_routes.route("/relationships/create", methods = ['POST'])
def create_relationship():
    '''
    Create a relationship between two users. The user who creates the
    relationship is stored in the 'requester' field, and the other user
    in the 'requestee' field. A relationship is set to not approved by 
    default. 
    '''
    if request.method == 'POST':
        requestee_email = request.form.get('requestee_email')
        
        if Accounts.verify_user_account(session["username"], session["id"]):
            requester_uid = session["uid"]

            # Check if requestee with given email exists
            requestee_uid = db.get_user(requestee_email)
            if requestee_uid is None:
                return make_response({"Error": "Requested user does not exist"})

            # Check if relationship exists
            existing_relationships = db.get_relationships()
            if (requester_uid, requestee_uid) not in existing_relationships \
                and (requestee_uid, requester_uid) not in existing_relationships:
                return make_response({"Error": "Relationship exists"})

            # Create relationship
            try:
                db.create_relationship(requester, requestee)
            except Exception as e:
                return make_response({"Database error": e.pgerror})

            return make_response("success": 1)
        return make_response({"invalid_account":1})
    return make_response({"invalid_request":1})

@relationships_routes.route("/relationships/get", methods = ['GET'])
def get_relationship():
    '''

    '''
    if request.method == 'GET':        
        if Accounts.verify_user_account(session["username"], session["id"]):
            uid = session["uid"]

            relationships =  

            return make_response(1)
        return make_response({"invalid_account":1})
    return make_response({"invalid_request":1})