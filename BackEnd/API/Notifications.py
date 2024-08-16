#flask
from flask import Flask, session, make_response,request, Blueprint

notifications_routes = Blueprint("notifications_routes", __name__)

#switch to using database
pending_notifications = {}

@notifications_routes.route("/add_notification")
def add_notification_external():
    '''
        add a pending notifcation to user
    '''
    session_id = request.args.get('session_id', None)
    session['id'] = session_id
    return make_response({"response":"id session key is set"},200)

def add_notification_local(session_id : int, nofication : str):
    return None
