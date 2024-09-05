#flask
from flask import Flask, session, make_response,request, Blueprint
import API.Locations as locations
import API.Notifications as notifications


notifications_routes = Blueprint("sync_routes", __name__)


@notifications_routes.route("/sync", methods = ['GET'])
def sync_route():
    '''
        get updates notfications locations etc...
        everyhting that needs to be regularly synced 
        for user
    '''
    sync_data = {}

    users_pending_notifications = notifications.get_notification(session["username"])
    notifications.clear_notification(session["username"])
    sync_data[notifications] = users_pending_notifications

    #get locations thing here