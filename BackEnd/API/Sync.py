###############################################
# Description
###############################################
# Route for API that contains all the account
# sync routes and supporting functions
###############################################
# Setup
###############################################
#flask
from flask import Flask, session, make_response,request, Blueprint
import API.Locations as locations
import API.Notifications as notifications


sync_routes = Blueprint("sync_routes", __name__)
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

@sync_routes.route("/sync", methods = ['GET'])
def sync_route():
    '''
        get updates notfications locations etc...
        everyhting that needs to be regularly synced 
        for user

        Form Data:
            None

        Return:
            Combiend Json of all the information needed for an update
    '''
    sync_data = {}

    users_pending_notifications = notifications.get_notification(session["username"])
    notifications.clear_notification(session["username"])
    sync_data["notifications"] = users_pending_notifications

    return make_response(sync_data)
