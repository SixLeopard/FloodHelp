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

        Form Data:
                requestee_email -> the email of user you want to request a relationship with

        Return:
            if succsessful: "success": 1}
            error1: {"Error": "Requested user does not exist"}
            error2: {"Error": "Relationship exists"}
            error3: {"Database error": e.pgerror}
            no login: {"invalid_account":1}
            not using POST: {"invalid_request":1}
    '''
    if request.method == 'POST':
        requestee_email = request.form.get('requestee_email')
        
        if Accounts.verify_user_account(session["username"], session["id"]):
            requester_uid = session["uid"]

            # Check if requestee with given email exists
            requestee = db.get_user(requestee_email)
            if requestee is None or requestee[0] is None:
                return make_response({"Error": "Requested user does not exist"})
            
            requestee_uid = requestee[0]

            # Check if relationship exists
            existing_relationships = db.get_approved_relationships(requester_uid) \
                + db.get_not_approved_relationships(requester_uid)
            if requestee_uid in existing_relationships:
                return make_response({"Error": "Relationship exists"})

            # Create relationship
            try:
                db.create_relationship(requester_uid, requestee_uid)
                return make_response({"success": 1})
            except Exception as e:
                return make_response({"internal_error": str(e)})
        return make_response({"invalid_account":1})
    return make_response({"invalid_request":1})

@relationships_routes.route("/relationships/get_approved", methods = ['GET'])
def get_approved_relationships():
    '''
        Get all approved relationships of the user who is currently logged in
        
        Form Data:
            None

        Return:
            if succsessful: json of all approved relationships
            no login: {"invalid_account":1}
            not using POST: {"invalid_request":1}
    '''
    if request.method == 'GET':        
        if Accounts.verify_user_account(session["username"], session["id"]):
            uid = session["uid"]
            try:
                relationship_uids =  db.get_approved_relationships(uid)
            except Exception as e:
                return make_response({"internal_error": str(e)})
            try:
                relationship_uids =  db.get_approved_relationships(uid)
            except Exception as e:
                return make_response({"internal_error": str(e)})
            try:
                relationship_uids =  db.get_approved_relationships(uid)
            except Exception as e:
                return make_response({"internal_error": str(e)})
            relationships = {}
            for ruid in relationship_uids:
                try:
                    # Returns: (uid, name, email, verified, password_hash, password_salt)
                    relationships[ruid] = db.get_user(ruid)[1]
                except Exception as e:
                    return make_response({'internal_error': str(e)})
                try:
                    # Returns: (uid, name, email, verified, password_hash, password_salt)
                    relationships[ruid] = db.get_user(ruid)[1]
                except Exception as e:
                    return make_response({'internal_error': str(e)})
                try:
                    # Returns: (uid, name, email, verified, password_hash, password_salt)
                    relationships[ruid] = db.get_user(ruid)[1]
                except Exception as e:
                    return make_response({'internal_error': str(e)})
            return make_response(relationships)
        return make_response({"invalid_account":1})
    return make_response({"invalid_request":1})

@relationships_routes.route("/relationships/get_not_approved", methods = ['GET'])
def get_not_approved_relationships():
    '''
        Get all NOT approved relationships of the user who is currently logged in

        Form Data:
            None

        Return:
            if succsessful: Json of all non-approved relationships
            no login: {"invalid_account":1}
            not using POST: {"invalid_request":1}
    '''
    if request.method == 'GET':        
        if Accounts.verify_user_account(session["username"], session["id"]):
            uid = session["uid"]
            try:
                relationship_uids =  db.get_not_approved_relationships(uid)
            except Exception as e:
                return make_response({'internal_error': str(e)})
            try:
                relationship_uids =  db.get_not_approved_relationships(uid)
            except Exception as e:
                return make_response({'internal_error': str(e)})
            try:
                relationship_uids =  db.get_not_approved_relationships(uid)
            except Exception as e:
                return make_response({'internal_error': str(e)})
            relationships = {}
            for ruid in relationship_uids:
                try:
                    # Returns: (uid, name, email, verified, password_hash, password_salt)
                    relationships[ruid] = db.get_user(ruid)[1]
                except Exception as e:
                    return make_response({'internal_error': str(e)})
                try:
                    # Returns: (uid, name, email, verified, password_hash, password_salt)
                    relationships[ruid] = db.get_user(ruid)[1]
                except Exception as e:
                    return make_response({'internal_error': str(e)})
                try:
                    # Returns: (uid, name, email, verified, password_hash, password_salt)
                    relationships[ruid] = db.get_user(ruid)[1]
                except Exception as e:
                    return make_response({'internal_error': str(e)})
            return make_response(relationships)
        return make_response({"invalid_account":1})
    return make_response({"invalid_request":1})

@relationships_routes.route("/relationships/approve/", methods = ['POST'])
def approve_relationship():
    '''
        Approve a relationship (if exists) between the user who is currently
        logged in, and the user specified in the other_user field of the request.
        If no relationship exists, return error.

        Form Data:
            other_user -> the users who's relationship request you want to approve

        Return:
            if succsessful: {"relationship_approved": 1}
            error1: {"no_relationship": 1}
            error2: {"missing_uid": 1}
            no login: {"invalid_account":1}
            not using POST: {"invalid_request":1}
    '''
    if request.method == 'GET':        
        if Accounts.verify_user_account(session["username"], session["id"]):
            uid1 = session['uid']
            uid2 = request.form.get('other_user')

            if uid2 is None:
                return make_response({"missing_uid": 1})
            
            try:
                db.approve_relationship(uid1, uid2)
                return make_response({"relationship_approved": 1})
            except Exception:
                return make_response({"no_relationship": 1})
        return make_response({"invalid_account":1})
    return make_response({"invalid_request":1})