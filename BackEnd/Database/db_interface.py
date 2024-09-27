import psycopg2
import re
from psycopg2.extensions import adapt, register_adapter, AsIs
import datetime
import json
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from External_API.ExtApi_RealTime import get_real_alerts
from External_API.ExtApi_RealTime import are_alerts_equal
from External_API.ExtApi_RealTime import random_fake_alerts
from External_API.ExtApi_RealTime import specific_fake_alert
from External_API.ExtApi_RealTime import compare_to_current_time

class Point(object):
    def __init__(self, x, y):
        self.x = x
        self.y = y

def adapt_point(point):
    x = adapt(point.x)
    y = adapt(point.y)
    return AsIs("'(%s, %s)'" % (x, y))

register_adapter(Point, adapt_point)


"""
The DBInterface class is an interface between a python program and the database specified in the
connect() method. In the case of this project, it is a Postgres database, running on an instance
of Amazon RDS.

conn:
    Refers to the connection to the database which the interface is connected to

cur:
    A cursor which is used to interact with the database. E.g. cur.execute("SELECT * FROM table")
"""
class DBInterface():
    def __init__(self):
        self.conn = None
        self.cur = None
        self.connect()

    """
    Establish a connection to the database.
    """
    def connect(self):
        self.conn = psycopg2.connect(
                dbname="floodhelp", \
                user="postgres", \
                password="FASMbCKzYWjwrn0JBRXs", \
                host="floodhelp-db.cde628megpl1.ap-southeast-2.rds.amazonaws.com", \
                port="5432")

        self.cur = self.conn.cursor()

    """
    Execute a query in the database. A connection must be established with connect() before 
    this method can be used. Note that the query is immediately committed to the database, 
    unless it fails. Any number of optional arguments can be passed to the function, which are
    treated as paremters to the query. The function returns the result of the query, or None if
    there is no result.

    query_string:
        The Postgres SQL query to be executed in the database.
    
    *args: 
        Optional arguments which will be passed to the query. This allows the use of prepared
        statements to mitigate SQL injection. The optional arguments must be passed in the 
        order they are to be used in they query. 
    """
    def query(self, query_string, *args):
        err = 0

        if not self.conn or not self.cur:
            raise Exception("Establish connection using connect() before executing queries")

        try:
            self.cur.execute(query_string, args)
        except psycopg2.Error as e:
            err = 1
            self.conn.rollback()
            raise e

        if not err:
            self.conn.commit()

            try:
                # Only queries return results
                result = self.cur.fetchall()
                return result
            except:
                pass

        return None

    """
    Closes connection to the database
    """
    def close(self):
        self.cur.close()
    
    """
    Insert a new user to the Users table.

    A unique UID is generated for each new user by the database and their Verified status is set to false. Additionally, an entry in the 'User_settings' table is made with the
    same 'uid' by a trigger in the database. The users email must be unique and can be used 
    to identify them in the database.
    """
    def create_user(self, name: str, email: str, pwd_hash: bytes, pwd_salt: bytes):        
        if (not re.search(r"[^@]+@[^@]+.[^@]+", email)):
            raise Exception('Invalid email address')
        
        if (pwd_hash is None or pwd_salt is None):
            raise Exception('Missing password hash or salt')
        
        query = "INSERT INTO Users (name, email, password_hash, password_salt) VALUES (%s, %s, %s, %s)"

        self.query(query, name, email, pwd_hash, pwd_salt)
    
    """
    Delete user with the given user id. 
    """
    def delete_user(self, uid):
        self.query("DELETE FROM Users WHERE uid = %s", uid)

    """
    Get data of user assosciated with the provided (unique) email address.

    Returns a tuple in the form:
        (uid, name, email, verified, password_hash, password_salt)
    """
    def get_user(self, email: str):
        '''
        Get a users information from the database.

        Paramters:
            email: The email of the user for who to get info

        Returns:
            A tuple in the form
                (uid, name, email, verified, pwd_hash, pwd_salt)
        '''
        user = self.query("SELECT * FROM Users WHERE email = %s", email)
        if not user:
            return None
        else:
            user = user[0]
            result = (user[0], user[1], user[2], user[3], user[4].tobytes(), user[5].tobytes())
            return result
        
    def get_user_by_uid(self, uid: int):
        '''
        Get a users information from the database.

        Paramters:
            uid: The uid of the user for who to get info

        Returns:
            A tuple in the form
                (uid, name, email, verified, pwd_hash, pwd_salt)
        '''
        user = self.query("SELECT * FROM Users WHERE uid = %s", uid)
        if not user:
            return None
        else:
            user = user[0]
            result = (user[0], user[1], user[2], user[3], user[4].tobytes(), user[5].tobytes())
            return result
    
    def relationship_exists(self, uid1: int = None, uid2: int = None, relationship_id: int = None) -> bool:
        '''
        Determines if an entry in the Relationships table with the two users already exists.

        If relationship_id is provided, then uses that to check. Else uses the user ids.

        Paramters:
            uid1/uid2: The ids of the users to check
            relationship_id: The id of the relationship

        Returns:
            True: If an entry with the uid1 and uid2 as requestee and requester (or vice versa)
            exists in the Relationships table.
            False: otherwise
        '''
        result = None
        
        if relationship_id is None:
            query = "SELECT * FROM Relationships WHERE ((requestee = %s AND requester = %s) OR (requester = %s AND requestee = %s))"
            result = self.query(query, uid1, uid2, uid1, uid2)
        else:
            query = "SELECT * FROM Relationships WHERE relationship_id = %s"
            result = self.query(query, relationship_id)

        if result == []:
            return False
        return True

    '''
    Create an entry for a new relationship between two users. Users who have an approved relationship
    can see each others location on the Floodhelp app. A user is approved if the 'approved' field in
    the relation is set to True (see approve_relationship() ). The field 'requester' specifies if the 
    user with uid_1 or uid_2 made the request, and hence, determines which user needs to accept the 
    request. Creating an entry in the the relationships table also creates a notification in the
    'notifications' table, with the uid of the requestee, through a database trigger.

    uid_1:
        The user ID (uid) of one user in the relationship. This must correspond to a 'uid' in the
        Users table.

    uid_2:
        The user ID (uid) of the other user in the relationship. This must correspond to a 'uid' 
        in the Users table.
    
    requster:
        A number to corresponding to which user made the request. If uid_1 made the request, then
        the number should be 1. If uid_2 made the request, then the number should be 1. In the
        database this is stored as a boolean attribute 'uid1_made_request', which is true if the
        user with uid1 made the request.
    '''
    def create_relationship(self, requester: int, requestee:int):        
        query = "INSERT INTO Relationships (requester, requestee) VALUES (%s, %s)"

        self.query(query, requester, requestee)
    
    def get_relationships(self, uid: int):
        """
        Get relationships for user with provided uid.

        uid (int):
            The uid of the user for who to retrieve relationships

        Returns:
            A dictionary with an entry for each relationship in the form:
                relationship_id: requester_name, requestee_name, approved
        """
        query = "SELECT relationship_id, requester, requestee, approved FROM Relationships WHERE (requester = %s OR requestee = %s)"
        relationships = self.query(query, uid, uid)
        query = "SELECT name, uid FROM users WHERE uid = %s"
        
        result = {}
        for r in relationships:
            requester = self.query(query, r[1])[0][0]
            requestee = self.query(query, r[2])[0][0]
            requester_uid = self.query(query, r[1])[0][1]
            requestee_uid = self.query(query, r[2])[0][1]

            result[r[0]] = {'requester_name': requester, 'requestee_name': requestee, 'requester_uid': requester_uid, 'requestee_uid': requestee_uid, 'approved': r[3]}

        return result
    
    def get_approved_relationships_ids(self, uid: int):
        """
        Get ids of users in approved relationships with user with provided uid. Relationships
        are considered approved if the 'approved' field in the database is set
        to true. Relationships can be approved manually be using the approve_relationship()
        function.

        uid (int):
            The uid of the user for who to retrieve relationships

        Returns:
            A list containing the uid's of the users who the user with the
            provided uid has approved relationships with.
        """
        query = "SELECT requester, requestee FROM Relationships WHERE (requester = %s OR requestee = %s) AND approved = true"
        relationships = self.query(query, uid, uid)

        result = [x[0] if x[1] == uid else x[1] for x in relationships]

        return result
    
    def approve_relationship(self, relationship_id) -> None:
        """
        Approve a relationship pf the relationship specified by relationship_id, by setting
        the 'approved' field of the entry in the 'Relationship' table to true.
        If no entry exists, then throws Exception to indicate this.

        relationship_id (int):
            The id the relationship
        """
        query = "SELECT * FROM Relationships WHERE relationship_id = %s"
        relationship = self.query(query, relationship_id)

        if relationship is not None:
            query = "UPDATE Relationships SET approved = true WHERE relationship_id = %s"
            self.query(query, relationship_id)
        else:
            raise Exception('Relationship does not exist')
    
    def delete_relationship(self, relationship_id: int) -> None:
        '''
        Delete a relationship with the specified
        relationship_id from from the Relationships table if it exists.

        Paramters:
            relationship_id: The id of the 
        
        Returns:
            1: If succeeded
            0: If not
        '''
        try:
            query = "DELETE FROM Relationships WHERE relationship_id = %s"
            self.query(query, relationship_id)

            query = "SELECT * FROM Relationships WHERE relationship_id = %s"
            relationship = self.query(query, relationship_id)

            if relationship != []:
                return 0
            return 1
        except:
            return 0

    """
    Not yet implemented. Will depend on the settings needed the front end.
    """
    def update_user_setting(self, uid: int, setting: str, value: str):
        settings = {
            'warnings_enabled': ['true', 'false'],
            'family_notifications_enabled': ['true', 'false']
        }
        
        if setting not in settings.keys():
            raise Exception(f"Unknown setting '{setting}'")
        
        if value not in settings[setting]:
            raise Exception(f"Invalid value '{value}' for setting '{setting}'")

        query = "UPDATE TABLE User_settings SET %s = %s WHERE uid = %s"

        self.execute(query, uid, setting, value)

    """
    Create a new area with the given name. The name must be unique.
    """
    def create_area(self, name):
        query = "INSERT INTO Area (name) VALUES (%s)"
        self.query(query, name)

    """
    Create a new hazard with the provided details

    title (str):
        The name of the hazard (e.g. flooded road)
    
    img_b64 (str):
        A string representation of the image encoded base64. The type of encoding
        doesn't really matter since the image is stored as a binary object in the
        database, but base64 is good.
    
    reporting_user (str):
        The user id of the user who made the report. This must correspond to the
        'uid' of an entry in the 'users' table.
    
    coordinates (tuple(float, float)):
        A tuple representing to coordinates of the location where the report is made.
    
    area_name (str):
        The name of the area in which the report is made. This is an optional paramter
        and can be left out if no area is to be specified. If specified, then must be
        'name' of an entry in the 'Area' table.

    Returns
        int: The hazard_id of the newly created hazard
    """
    def create_hazard(self, title: str, img_b64: str, reporting_user: int, \
            coordinates: tuple[float], description:str = None, area_name: str = None) -> int:
        query = 'INSERT INTO hazards (title, image, reporting_user, area, coordinates, description) VALUES (%s, %s, %s, %s, %s, %s)'

        self.query(query, title, img_b64, reporting_user, area_name, Point(coordinates[0], coordinates[1]), description)

        # Get id of newly created hazard. Auto incremented by database
        query = 'SELECT MAX(hazard_id) FROM Hazards'
        return self.query(query)[0][0]
    
    """
    Retrieve hazard with the given ID from the database.

    Returns a dictionary containing:
        hazard_id (int): The unique ID of the hazard
        title (str): The name of the hazard
        datetime (str): The time at which the hazard was created in the format "DD/MM/YY HH:MM:SS"
        reporting_user_id (int): The UID of the user who reported the hazard
        area_name (str): The name of the area in which the hazard was reported
        coordinates (str): The coordinates at which the hazard was reported in the form "(x, y)"
        image (str): The string encoded representation of the image    
    """
    def get_hazard(self, hazard_id: int):
        query = 'SELECT * FROM Hazards WHERE hazard_id = (%s)'
        result = self.query(query, hazard_id)

        if result:
            result = result[0]
            img = None if result[6] is None else str(result[6].tobytes())[2:]
            hazard = {
                'hazard_id': result[0],
                'title': result[1],
                'datetime': result[2].strftime('%d/%m/%y %H:%M:%S'),
                'reporting_user_id': result[3],
                'area_name': result[4],
                'coordinates': result[5],
                'img': img,
                'description': result[7],
                'img': img,
                'description': result[7]
            }
            return hazard
        
        return None
    
    """
    Retrieve the coordinates of all hazards and the corresponding hazard_id
    from database. Useful for mapping hazards without retrieving details of
    all hazards. When a user selects a hazard to see more detail, can call
    get_hazard() function to retrieve details.

    Returns:
        A list in the form:

            [{hazard_id; int, coordinates: (lattitude, longitude)}, ...]

        Where hazard_id is an integer and lattitude and longitude are floats.
        The list may contain any number of elements including 0.
    """
    def get_all_hazard_coordinates(self):
        query = "SELECT hazard_id, coordinates, datetime, title FROM Hazards"
        results = self.query(query)
        final = {}
        
        for result in results:
            hazard = {
                'hazard_id': result[0],
                'coordinates': result[1],
                'datetime': result[2],
                'title': result[3]
            }
            final[result[0]] = hazard

        return final
    
    """
    Retrieve the coordinates of all hazards and the corresponding hazard_id
    from database. Useful for ranking hazards without retrieving details of
    all hazards. When a user selects a hazard to see more detail, can call
    get_hazard() function to retrieve details.

    Returns:
        A dict in the form:

            {hazard_id: {hazard_id; int, coordinates: (lattitude, longitude)}, ...}

        Where hazard_id is an integer and lattitude and longitude are floats.
        The list may contain any number of elements including 0.
    """
    def get_all_hazard_ranking_dict(self):
        query = "SELECT hazard_id, coordinates, datetime, title, reporting_user FROM Hazards"
        results = self.query(query)
        final = {}
        
        for result in results:
            hazard = {
                'hazard_id': result[0],
                'coordinates': result[1],
                'datetime': result[2],
                'title': result[3],
                'reporting_user_id' : result[4]
            }
            final[str(result[0])] = hazard

        return final

    """
    Retrieve all hazards with all corresponding details to that hazard. Returns
    a list of dictionaries in the form:

        [{hazard_id, title, datetime, reporting_user, area, coordinates, image, description}, ...]

    Where:
        hazard_id (int): The numerical unique ID of the hazard
        title (str): the name or type of hazard
        datetime (str): The date and time when the hazard was reported in the form "DD/MM/YYY HH:MM:SS"
        reporting_user (int): The uid of the user who reported the hazard
        area (str): The area in which the report was made. Usually None since we chose not to use
        coordinates (string): The coordinates where the report was made (latt, long)
        img (str): The string encoded representation of the image
    """
    def get_all_hazard_details(self):
        query = "SELECT * FROM Hazards"
        results = self.query(query)
        final = {}

        for result in results:
            hazard = {
                'hazard_id': result[0],
                'title': result[1],
                'datetime': result[2].strftime('%d/%m/%y %H:%M:%S'),
                'reporting_user_id': result[3],
                'area_name': result[4],
                'coordinates': result[5],
                'img': None if result[6] is None else str(result[6].tobytes())[2:],
                'description': result[7]
            }
            final[result[0]] = hazard
        
        return final
    
    """
    Retrieve all hazards reported by user with the specified uid, including all corresponding 
    details to that hazard. Returns a list of dictionaries in the form:

        [{hazard_id, title, datetime, reporting_user, area, coordinates, image, description}, ...]

    Where:
        hazard_id (int): The numerical unique ID of the hazard
        title (str): the name or type of hazard
        datetime (str): The date and time when the hazard was reported in the form "DD/MM/YYY HH:MM:SS"
        reporting_user (int): The uid of the user who reported the hazard
        area (str): The area in which the report was made. Usually None since we chose not to use
        coordinates (string): The coordinates where the report was made (latt, long)
        img (str): The string encoded representation of the image
    """
    def get_all_reports_by_user(self, uid:int) -> dict:
        query = "SELECT * FROM Hazards WHERE reporting_user = %s"
        results = self.query(query, uid)

        final = {}

        for result in results:
            hazard = {
                'hazard_id': result[0],
                'title': result[1],
                'datetime': result[2].strftime('%d/%m/%y %H:%M:%S'),
                'reporting_user_id': result[3],
                'area_name': result[4],
                'coordinates': result[5],
                'img': None if result[6] is None else str(result[6].tobytes())[2:],
                'description': result[7]
            }
            final[result[0]] = hazard
        
        return final

    def insert_historical_data(self, flood_risk: str, flood_type: str, \
        coordinates: str, datatype: str, geo: str):

        query = "INSERT INTO historical_flood_risk (flood_risk, flood_type, coordinates, datatype, geo) VALUES (%s, %s, %s, %s, %s)"
        self.query(query, flood_risk, flood_type, coordinates, datatype, geo)

    def get_historical_data(self):
        query = "SELECT * FROM historical_flood_risk"
        result = self.query(query)

        results = []
        for row in result:
            new_row = []
            new_row.append(row[0])
            new_row.append(row[1])
            new_row.append(row[2])
            new_row.append(str(row[3].tobytes()))
            new_row.append(str(row[4].tobytes()))
            new_row.append(str(row[5].tobytes()))
            results.append(new_row)

        return results

    """
    Insert a new entry into the 'Notifications' table.

    uid (int):
        The uid of the user to which the notification is to be sent
    
    notification_type (int):
        The type of notification (arbitrary at this point, just a string)

    content (str):
        The contents of the warning.
    """
    def create_notification(self, uid: int, notification_type: str, content: str):
        query = "INSERT INTO Notifications (uid, type, content) VALUES (%s, %s, %s)"
        self.query(query, uid, notification_type, content)

    """
    Retrieve notifications for the specfied user and delete from the database.

    Returns a list of tuples in the form:
        [(uid, notification_id, 'type', 'content'), ...]

    Ignore the notification ID
    """
    def get_notifications(self, uid: int):
        query = "SELECT * FROM Notifications WHERE uid = %s"
        result = self.query(query, uid)

        # Remove retrieved notifications from database.
        # Safer option would be to use transaction, or to remove only
        # notifications with retrieved notification ID's
        query = "DELETE FROM Notifications WHERE uid = %s"
        self.query(query, uid)

        return result

    """
    Insert a new entry into the 'Notifications' table.

    uid (int):
        The uid of the user to which the notification is to be sent
    
    notification_type (int):
        The type of notification (arbitrary at this point, just a string)

    content (str):
        The contents of the warning.
    """
    def create_notification(self, uid: int, notification_type: str, content: str):
        query = "INSERT INTO Notifications (uid, type, content) VALUES (%s, %s, %s)"
        self.query(query, uid, notification_type, content)

    """
    Retrieve notifications for the specfied user and delete from the database.

    Returns a list of tuples in the form:
        [(uid, notification_id, 'type', 'content'), ...]

    Ignore the notification ID
    """
    def get_notifications(self, uid: int):
        query = "SELECT * FROM Notifications WHERE uid = %s"
        result = self.query(query, uid)

        # Remove retrieved notifications from database.
        # Safer option would be to use transaction, or to remove only
        # notifications with retrieved notification ID's
        query = "DELETE FROM Notifications WHERE uid = %s"
        self.query(query, uid)

        return result
    
    def get_alerts(self):
        """
            Gets all current alerts in the database 
            
            Returns a list of tuples in the form:
                [('headline', 'location', 'risk', 'certainty', 'start', 'end', 'coordinates'), ...]

        """
        query = "SELECT * FROM Alerts"
        result = self.query(query)
        return result
    
    def update_alerts_real(self):
        """
            Add all ongoing alerts to database, if not already there
            Limit of use: Once per 5 minutes
            Returns:
                None

        """
        alerts = get_real_alerts()
        
        for alert in alerts:
            alert = json.loads(alert)
            is_recorded = False
            for recorded_alert in self.get_alerts():
                if(are_alerts_equal(alert, recorded_alert)):
                    is_recorded = True

            if(is_recorded == False):
                query = "INSERT INTO Alerts (headline, location, risk, certainty, start_ts, end_ts, coordinates) VALUES (%s, %s, %s, %s, %s, %s, %s)"
                self.query(query, alert["headline"], alert["location"], alert["risk"], alert["certainty"], alert["start"], alert["end"], alert["coordinates"]) 

    def update_alerts_fake_random(self):
        """
            Add 1-3 random fake alerts to database
            Limit of use: Once per 5 minutes
            Returns:
                None

        """
        alerts = random_fake_alerts()
        for alert in alerts:
            alert = json.loads(alert)
            is_recorded = False
            for recorded_alert in self.get_alerts():
                if(are_alerts_equal(alert, recorded_alert)):
                    is_recorded = True

            if(is_recorded == False):
                query = "INSERT INTO Alerts (headline, location, risk, certainty, start_ts, end_ts, coordinates) VALUES (%s, %s, %s, %s, %s, %s, %s)"
                self.query(query, alert["headline"], alert["location"], alert["risk"], alert["certainty"], alert["start"], alert["end"], alert["coordinates"])   

    def update_alerts_fake_specific(self, headline: str, location: str, risk: str, certainty: str, issue_date: str, expirydate: str, coordinates: tuple):
        """
            Add one custom fake alert to database
            Limit of use: Once per 5 minutes

            Args:
                'headline' (str): general headline
                'location' (str): area in which alert is in
                'risk' (str): risk level of alert
                'certainty' (str): certainty of alert
                'start' (str): issue date of alert
                'end' (str): expiry date of alert
                'coordinates' (tuple (int, int)): exact coordinates of alert

            If you want to specify exact coordinates of alert, put in the coordinates that you want in "coordinates" argument. If you want to just provide a location
            without specifying exact coordinates, input (0,0) into the "coordinates" argument.

            Returns:
                None

        """
        alert = specific_fake_alert(headline, location, risk, issue_date, expirydate, coordinates)
        alert = json.loads(alert)
        is_recorded = False
        for recorded_alert in self.get_alerts():
            if(are_alerts_equal(alert, recorded_alert)):
                is_recorded = True

        if(is_recorded == False):
            query = "INSERT INTO Alerts (headline, location, risk, certainty, start_ts, end_ts, coordinates) VALUES (%s, %s, %s, %s, %s, %s, %s)"
            self.query(query, alert["headline"], alert["location"], alert["risk"], alert["certainty"], alert["start"], alert["end"], alert["coordinates"])
   
        
    def delete_expired_alerts(self):
        """
            Deletes all expired alerts in the database
            Returns:
                None
        """
        alerts = self.get_alerts()
        for alert in alerts:
            id = alert[0]
            expiry_date = alert[6]
            if(compare_to_current_time(expiry_date) == "past"):
                try:
                    query = "DELETE FROM Alerts WHERE id = %s"
                    self.query(query, id)
                    return 1
                except:
                    return 0







