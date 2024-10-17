###############################################
# Description
###############################################
# Route for API that contains all the session
# related routes and supporting functions
###############################################
# Setup
###############################################
from flask import Flask, Blueprint, request, make_response, session

session_routes = Blueprint("session_routes", __name__)
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

@session_routes.route("/session/set",  methods = ['POST'])
def set_session_route():
    '''
        set the current session id

        takes session_id arg as the session id to set it to

        Form Data:
            None

        Return:
            {"response":"id session key is set"}
    '''
    session_id = request.args.get('session_id', None)
    session['id'] = session_id
    return make_response({"response":"id session key is set"},200)

@session_routes.route("/session/get", methods = ['GET'])
def get_session_route():
    '''
        get the current session id

        Form Data:
            None

        Return:
            {"response":f"the id is {session.get('id')}
    '''
    return make_response({"response":f"the id is {session.get('id')}"},200)
