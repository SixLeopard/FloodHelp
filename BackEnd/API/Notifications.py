#flask
from flask import Flask, session, make_response,request, Blueprint
import API.Login as Login

notifications_routes = Blueprint("notifications_routes", __name__)

#switch to using database
pending_notifications = {}

@notifications_routes.route("/add_notification")
def add_notification_external():
    '''
        submit new user report
    '''
    if request.method == 'POST':
        notification = request.form.get('notification')
        receiver = request.form.get('receiver')
        if Login.verify_user_account(session["username"], session["id"]):
            if receiver in pending_notifications:
                pending_notifications[receiver].append(notification)
            else:
                pending_notifications[receiver] = [notification]
            
            return make_response("{notifcation added: " + notification + "}")
        
        return make_response({"invalid_account":1})
    
    return make_response({"invalid_request":1})

def add_notification_local(session_id : int, nofication : str):
    return None
