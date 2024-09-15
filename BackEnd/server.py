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
import API.Accounts as APIlogin
import API.Session as APIsession
import API.Notifications as APINotifications
import API.UserReport as APIUserReport
import API.Sync as APISync
import API.Relationships as APIRelationships
###############################################
# File Info
###############################################
__author__ = '{author}'
__copyright__ = 'Copyright {year}, {project_name}'
__credits__ = ['{credit_list}']
__license__ = '{license}'
__version__ = '{mayor}.{minor}.{rel}'
__maintainer__ = '{maintainer}'
__email__ = '{contact_email}'
__status__ = '{dev_status}'
###############################################

# Initializing flask app
app = Flask(__name__)
auto = Autodoc(app)

#addin externals
app.register_blueprint(APIlogin.login_routes)
app.register_blueprint(APIsession.session_routes)
app.register_blueprint(APIUserReport.userreport_routes)
app.register_blueprint(APINotifications.notifications_routes)
app.register_blueprint(APISync.sync_routes)
app.register_blueprint(APIRelationships.relationships_routes)

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
    
    '''
    return auto.html() 

# Running app
if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)