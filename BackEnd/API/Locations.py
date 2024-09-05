#flask
from flask import Flask, session, make_response,request, Blueprint
import API.Accounts as Accounts

from API.database import DBInterface

location_routes = Blueprint("location_routes", __name__)
db = DBInterface()

'''
A dictionary containing a mapping of uid to the last known location of the
user with that uid. If no location is known, then the value of None.

locations = {
    uid1: location1
    uid2: location2
    uid3: location3
}
'''
locations = {}

@location_routes.route("/locations/update", methods = ['POST'])
def update_locations():
    '''
        Update user's current location in the in memory dictionaries of each
        of the users who are allowed to track them. Additionally, get locations
        of each of the users who the user is allowed to track. If no location is 
        currently known for a user, the mapping is set to None.

        Return:
            A JSON string of the locations of each of the users who the user
            who made the request can track. If no location known, the value of
            the location is None.
    '''
    if request.method == 'POST':
        curr_location = request.form.get('location')
        
        if Accounts.verify_user_account(session["username"], session["id"]):
            uid = session["uid"]

            # Update user location
            locations[uid] = curr_location

            # Get locations of users who current user has approved relations with
            relationships = db.get_relationships(uid)   # Only returns approved relationships
            result = {}
            for relation_uid in relationships:
                result[relation_uid] = locations[relation_uid]

            return make_response(result)
        return make_response({"invalid_account":1})
    return make_response({"invalid_request":1})