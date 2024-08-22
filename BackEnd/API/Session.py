from flask import Flask, Blueprint, request, make_response, session

session_routes = Blueprint("session_routes", __name__)

@session_routes.route("/session/set",  methods = ['POST'])
def set_session_route():
    '''
        set the current session id
    '''
    session_id = request.args.get('session_id', None)
    session['id'] = session_id
    return make_response({"response":"id session key is set"},200)

@session_routes.route("/session/get", methods = ['GET'])
def get_session_route():
    '''
        get the current session id
    '''
    return make_response({"response":f"the id is {session.get('id')}"},200)