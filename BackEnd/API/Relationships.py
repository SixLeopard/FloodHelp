#flask
from flask import Flask, session, make_response,request, Blueprint
import API.Accounts as Accounts

from API.database import database_interface as db

relationships_routes = Blueprint("relationships_routes", __name__)

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
            requestee_uid = db.get_user(requestee_email)[0]
            if requestee_uid is None:
                return make_response({"Error": "Requested user does not exist"})

            # Check if relationship exists
            existing_relationships = db.get_relationships(requester_uid)
            if (requester_uid, requestee_uid) not in existing_relationships \
                and (requestee_uid, requester_uid) not in existing_relationships:
                return make_response({"Error": "Relationship exists"})

            # Create relationship
            try:
                db.create_relationship(requester_uid, requestee_uid)
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

            relationship_uids =  db.get_relationships(uid)
            
            relationships = {}
            for ruid in relationship_uids:
                # Returns: (uid, name, email, verified, password_hash, password_salt)
                relationships[ruid] = db.get_user(ruid)[1]

            return make_response(relationships)
        return make_response({"invalid_account":1})
    return make_response({"invalid_request":1})