import psycopg2
import re
from psycopg2.extensions import adapt, register_adapter, AsIs

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
        if not self.conn or not self.cur:
            raise Exception("Establish connection using connect() before executing queries")

        try:
            self.cur.execute(query_string, args)
        except psycopg2.Error as e:
            raise Exception(e.pgerror)

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

    A unique UID is generated for each new user by the database and their Verified status
    is set to false. Additionally, an entry in the 'User_settings' table is made with the
    same 'uid' by a trigger in the database. The users email must be unique and can be used 
    to identify them in the database.
    """
    def create_user(self, name: str, email: str, pwd_hash: str, pwd_salt: str):
        if (re.search(r"[^a-zA-z]", name.strip('\n'))):
            raise Exception('User name may only only contain alphabetical characters')
        
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
    def create_relationship(self, uid_1: int, uid_2:int, requester: int):
        if not (requester == 1 or requester == 2):
            raise Exception("The 'requester' parameter must have a value of 1 or 2")

        if requester == 1:
            requester = uid_1
            requestee = uid_2
        else:
            requester = uid_2
            requestee = uid_1
        
        query = "INSERT INTO Relationships (requester, requestee) VALUES (%s, %s)"

        self.query(query, requester, requestee)
    
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
    """
    def create_hazard(self, title: str, img_b64: str, reporting_user: int, \
            coordinates: tuple[float], area_name: str = None):
        query = 'INSERT INTO hazards (title, image, reporting_user, area, coordinates) VALUES (%s, %s, %s, %s, %s)'

        self.query(query, title, img_b64, reporting_user, area_name, Point(coordinates[0], coordinates[1]))