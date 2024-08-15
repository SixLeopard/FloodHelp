from flask import Flask, Blueprint, request, make_response, session

session_routes = Blueprint("session_routes", __name__)

@session_routes.route("/set-session")
def set_session():
    '''
        set the current session id
    '''
    session_id = request.args.get('session_id', None)
    session['id'] = session_id
    return make_response({"response":"id session key is set"},200)

@session_routes.route("/get-session")
def get_session():
    '''
        get the current session id
    '''
    return make_response({"response":f"the id is {session.get('id')}"},200)