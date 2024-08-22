#flask
from flask import Flask, session, make_response,request, Blueprint
import API.Accounts as Accounts

notifications_routes = Blueprint("notifications_routes", __name__)

#switch to using database
pending_notifications = {}


def add_notification(receiver : str, notification : str) -> None:
    if receiver in pending_notifications:
        pending_notifications[receiver].append(notification)
    else:
        pending_notifications[receiver] = [notification]

def get_notification(receiver : str) -> list[str]:
    if receiver in pending_notifications:
        return pending_notifications[receiver]
    else:
        return []

def clear_notification(receiver : str) -> None:
    if receiver in pending_notifications:
        pending_notifications[receiver] = []

@notifications_routes.route("/notifications/add", methods = ['POST'])
def add_notification_route():
    '''
        submit new pending notification
    '''
    if request.method == 'POST':
        notification = request.form.get('notification')
        receiver = request.form.get('receiver')
        if Accounts.verify_user_account(session["username"], session["id"]):
            add_notification(receiver,notification)

            return make_response("{notifcation added: " + str(notification) + "}")
        
        return make_response({"invalid_account":1})
    
    return make_response({"invalid_request":1})


@notifications_routes.route("/notifications/get", methods = ['GET'])
def get_notification_route():
    '''
        get all pending notification
    '''
    if request.method == 'GET':
        if Accounts.verify_user_account(session["username"], session["id"]):
            users_pending_notifications = get_notification(session["username"])
            clear_notification(session["username"])
            return make_response("{current pending notifications: " + str(users_pending_notifications) + "}")
        
        return make_response({"invalid_account":1})
    
    return make_response({"invalid_request":1})