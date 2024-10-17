###############################################
# Description
###############################################
# Route for API that contains all the notification
# related routes and supporting functions
###############################################
# Setup
###############################################
#flask
from flask import Flask, session, make_response,request, Blueprint
import API.Accounts as Accounts

notifications_routes = Blueprint("notifications_routes", __name__)
###############################################
# File Info
###############################################
__author__ = 'FloodHelp BeckEnd Team'
__copyright__ = 'Copyright 2024, FloodHelp API'
__credits__ = ['Flask', 'Autodoc']
__license__ = 'All Rights Reserved'
__version__ = '0.8.9'
__maintainer__ = 'FloodHelp BeckEnd Team'
__status__ = 'Prototype'
###############################################

pending_notifications = {}

def add_notification(receiver : str, notification : str) -> None:
    receiver  = str(receiver)
    if receiver in pending_notifications:
        pending_notifications[receiver].append(notification)
    else:
        pending_notifications[receiver] = [notification]

def get_notification(receiver : str) -> list[str]:
    receiver  = str(receiver)
    if receiver in pending_notifications:
        return pending_notifications[receiver]
    else:
        return []

def clear_notification(receiver : str) -> None:
    receiver  = str(receiver)
    if receiver in pending_notifications:
        pending_notifications[receiver] = []

@notifications_routes.route("/notifications/add", methods = ['POST'])
def add_notification_route():
    '''
        submit new pending notification

        Form Data:
            notification -> the notification string to send
            receiver -> the uid of who you want to send notification too

        Return:
            if succsessful: {notifcation added: " + str(notification) + "}
            no login: {"invalid_account":1}
            not using POST: {"invalid_request":1}
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

        Form Data:
            None

        Return:
            if succsessful: {current pending notifications: " + str(users_pending_notifications) + "}"
            in which users_pending_notifications is json of all the user notification
            no login: {"invalid_account":1}
            not using POST: {"invalid_request":1}
    '''
    if request.method == 'GET':
        if Accounts.verify_user_account(session["username"], session["id"]):
            users_pending_notifications = get_notification(session["uid"])
            clear_notification(session["uid"])
            return make_response({"current pending notifications": str(users_pending_notifications)})
        
        return make_response({"invalid_account":1})
    
    return make_response({"invalid_request":1})
