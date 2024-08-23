from db_interface import DBInterface

db = DBInterface()

def test_select():
    result = db.query("SELECT * FROM Users")
    print(result)
    print(type(result))

def test_relationships():
    db.create_relationship(31, 32, 1)
    print(db.query("select * from relationships"))

def test_create_user():
    db.create_user('john', 'j13@gmail.com', 'sadfg', 'dsafg')
    db.create_user('john', 'j14@gmail.com', 'sadfg', 'dsafg')

def test_create_hazard():
    db.create_hazard('flooded road', '7uhifenvvag9', 31, (10.123, 20.321))

def test_get_hazard():
    print(db.get_hazard(3))

def test_historical_data():
    db.insert_historical_data('high', 'river', 'bleh', 'blah', 'bloh')
    print(db.get_historical_data())

def test_get_user():
    print(db.get_user('j11@gmail.com'))

def test_notifications():
    db.create_notification(31, 'flood warning', 'some text')
    print(db.get_notifications(31))

# test_create_user()
# test_relationships()
# test_select()
# test_create_hazard()
# test_get_hazard()
# test_historical_data()
# test_get_user()
test_notifications()

