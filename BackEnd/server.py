###############################################
# Description
###############################################
# Main server for api
# registers all the routes to the app
# sets up root routes
# and starts the server
###############################################
# Setup
###############################################
#Import External Libraries
from flask import Flask, session, make_response,request, Blueprint, render_template
from flask_session import Session
from cachelib.file import FileSystemCache
from autodoc import Autodoc
import datetime
import os
# Import our Files
from cfg import *
import API.Accounts as APIlogin
import API.Session as APIsession
import API.Notifications as APINotifications
import API.UserReport as APIUserReport
import API.Sync as APISync
import API.Relationships as APIRelationships
import API.External_data as APIExternal
import API.Locations as APILocations
import API.Check_In as APICHeckIn
###############################################
# File Info
###############################################
__author__ = 'FloodHelp BeckEnd Team'
__copyright__ = 'Copyright 2024, FloodHelp API'
__credits__ = ['Flask', 'Autodoc']
__license__ = 'All Rights Reserved'
__version__ = '0.8.9'
__maintainer__ = 'FloodHelp BeckEnd Team'
__email__ = 'jamie.westerhout@student.uq.edu.au'
__status__ = 'Prototype'
###############################################

#addin externals
app.register_blueprint(APIlogin.login_routes)
app.register_blueprint(APIsession.session_routes)
app.register_blueprint(APIUserReport.userreport_routes)
app.register_blueprint(APINotifications.notifications_routes)
app.register_blueprint(APISync.sync_routes)
app.register_blueprint(APIRelationships.relationships_routes)
app.register_blueprint(APIExternal.externalData_routes)
app.register_blueprint(APILocations.location_routes)
app.register_blueprint(APICHeckIn.checkin_routes)

#Session
SESSION_TYPE = 'cachelib'
SESSION_SERIALIZATION_FORMAT = 'json'
SESSION_CACHELIB = FileSystemCache(threshold=500, cache_dir=f"{os.path.dirname(__file__)}/sessions")

app.config.from_object(__name__)

# Initiate the session
Session(app)
auto = Autodoc(app) 

# Route for testing to ensure api is functioning
@app.route('/test')
def test_route():
    # Returning inro data through api
    time_stamp = datetime.datetime.now()
    return make_response({
        'Intro':"Welcome to FloodHelp API", 
        "Current Time":time_stamp
    })

# root route, just has introduction page to the api
@app.route('/')
def root_route():
    '''
      Returning welcome page through api
    '''
    return render_template("WelcomePage.html")

# This route generates HTML for the autodocs documentation 
@app.route('/documentation') 
def documentation_route(): 
    '''
        Displays documentation page

        Documentation is genertated for each of the routes
        regested to the flask server, then gathers them
        all and obtains there methods "get" or "post"
        this is then used in combintation with the doc
        strings on the route to generate the documenation automaticaly 
    '''
    return auto.html() 

# Running app
if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)
