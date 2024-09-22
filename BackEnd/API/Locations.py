#flask
from flask import Flask, session, make_response,request, Blueprint
import API.Accounts as Accounts

from API.database import database_interface as db

location_routes = Blueprint("location_routes", __name__)

'''
A dictionary containing a mapping of uid to the last known location of the
user with that uid. If no location is known, then the value of None.

locations = {
    uid1: {rel1: location1, rel2: location, ..},
    uid2: {rel1: location1, rel2: location, ..},
    uid3: {rel1: location1, rel2: location, ..},
    ...
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

        Form Data:
            location -> users current location

        Return:
            A JSON string of the locations of each of the users who the user
            who made the request can track. If no location known, the value of
            the location is None.
    '''
    if request.method == 'POST':
        curr_location = request.form.get('location')
        
        if Accounts.verify_user_account(session["username"], session["id"]):
            uid = session["uid"]

            # add users location to pending dict for all the users they have relationship with
            relationships = db.get_approved_relationships_ids(uid)   # Only returns approved relationships
            for relation_uid in relationships:
                if relation_uid not in locations:
                    locations[relation_uid] = {session["uid"] : curr_location}
                else:
                    locations[relation_uid][session["uid"]] = curr_location
            # get current users pending locations then clear them if there is any
            if (session["uid"] in locations):
                result = locations[session["uid"]]
                locations[session["uid"]].clear()
            else:
                result = {}
            print(locations)
            return make_response(result)
        return make_response({"invalid_account":1})
    return make_response({"invalid_request":1}) 
