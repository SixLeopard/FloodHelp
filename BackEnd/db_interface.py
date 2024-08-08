import psycopg2

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
    Execute a query in the database. A conneciton must be established with connect() before 
    this method can be used.
    """
    def query(self, query_string):
        if not self.conn or not self.cur:
            raise Exception("Establish connection using connect() before executing queries")

        self.cur.execute(query_string)
        result = self.cur.fetchall()
        return result
