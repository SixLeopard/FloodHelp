#flask
from flask import Flask, session, make_response,request, Blueprint
import API.Accounts as Accounts
import API.Notifications as Notifications

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
            error1: {"user_does_not_exist": 1}
            error2: {"relationship_exists": 1}
            error3: {"self_relationship": 1}
            error4: {"database error": e.pgerror}
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
                return make_response({"user_does_not_exist": 1})

            if requestee[2] == db.get_user_by_uid(requester_uid)[2]:
                return make_response({"self_relationship": 1})
            
            requestee_uid = requestee[0]

            # Check if relationship exists
            if db.relationship_exists(uid1=requestee_uid, uid2=requester_uid):
                return make_response({"relationship_exists": 1})

            # Create relationship
            try:
                db.create_relationship(requester_uid, requestee_uid)

                Notifications.add_notification(str(requestee), f'User "{session['username']}" has requested to follow you')

                Notifications.add_notification(str(requestee), f'User "{session["username"]}" has requested to follow you')
                return make_response({"success": 1})
            except Exception as e:
                return make_response({"internal_error": str(e)})
        return make_response({"invalid_account":1})
    return make_response({"invalid_request":1})

@relationships_routes.route("/relationships/get_relationships", methods = ['GET'])
def get_relationships():
    '''
        Get all relationships of the user who is currently logged in

        Form Data:
            None

        Return:
            if succsessful: Json of all relationships (see format beloew)
            no login: {"invalid_account":1}
            not using POST: {"invalid_request":1}
        
        Relationships format:
            {relationship_id: {requester_name, requester_uid, requestee_name, requestee_uid, approved}, ...}
    '''
    if request.method == 'GET':        
        if Accounts.verify_user_account(session["username"], session["id"]):
            uid = session["uid"]
            try:
                relationships = db.get_relationships(uid)
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
            relationship_id -> the id of the relationship to approve

        Return:
            if succsessful: {"relationship_approved": 1}
            error1: {"no_relationship": 1}
            error2: {"missing_relationship_id": 1}
            error3: {"internal_error": data}
            no login: {"invalid_account":1}
            not using POST: {"invalid_request":1}
    '''
    if request.method == 'POST':        
        if Accounts.verify_user_account(session["username"], session["id"]):
            relationship_id = request.form.get('relationship_id')
            uid = session["uid"]
            relationships = db.get_relationships(uid)
            print(relationships)
            requestee_uid = relationships[int(relationship_id)]["requestee_uid"]
            if requestee_uid != session["uid"]:
                return make_response({"current_user_not_requestee":1})

            if relationship_id is None:
                return make_response({"missing_relationship_id": 1})
            
            try:
                db.approve_relationship(relationship_id)
                return make_response({"relationship_approved": 1})
            except Exception as e:
                return make_response({"internal_error": str(e)})
        return make_response({"invalid_account":1})
    return make_response({"invalid_request":1})

@relationships_routes.route("/relationships/delete/", methods = ['POST'])
def delete_relationship():
    '''
    Delete a relationship specified by the relationship id

    Form Data:
        relationship_id -> the id of the relationship to delete
    
    Returns:
        if succsessful: {"relationship_deleted": 1}
        error1: {"no_relationship": 1}
        error2: {"missing_relationship_id": 1}
        error3: {"internal_error": data}
        error4: {"failed": 1}
        no login: {"invalid_account":1}
        not using POST: {"invalid_request":1}
    '''
    if request.method == 'POST':        
        if Accounts.verify_user_account(session["username"], session["id"]):
            relationship_id = request.form.get('relationship_id')

            if relationship_id is None:
                return make_response({"missing_relationship_id": 1})

            # Check if relationship exists
            if not db.relationship_exists(relationship_id=relationship_id):
                return make_response({"no_relationship": 1})
        
            try:
                success = db.delete_relationship(relationship_id)
                if not success:
                    return make_response({'failed': 1})
                return make_response({"relationship_deleted": 1})
            except Exception as e:
                return make_response({'internal_error': str(e)})
        return make_response({"invalid_account":1})
    return make_response({"invalid_request":1})
