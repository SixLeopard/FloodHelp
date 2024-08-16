import psycopg2
import re

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

        try:
            # Only updates need to be committed
            self.conn.commit()
        except:
            pass

        try:
            # Only queries need to return results
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
    is set to false.
    """
    def create_user(self, name: str, email: str, pwd_hash: str, pwd_salt: str):
        if (re.search(r"[^a-zA-z]", name.strip('\n'))):
            return Exception('Username may only only contain alphabetical characters')
        
        if (not re.search(r"[^@]+@[^@]+.[^@]+", email)):
            return Exception('Invalid email address')
        
        if (pwd_hash is None or pwd_salt is None):
            return Exception('Missing password hash or salt')
        
        query = "INSERT INTO Users (name, email, password_hash, password_salt) VALUES (%s, %s, %s, %s)"

        self.query(query, name, email, pwd_hash, pwd_salt)