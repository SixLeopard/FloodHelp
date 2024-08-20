from db_interface import DBInterface

db = DBInterface()
db.connect()
result = db.query("SELECT * FROM Test")
print(result)
print(type(result))
