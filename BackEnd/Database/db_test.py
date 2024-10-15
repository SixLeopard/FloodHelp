from db_interface import DBInterface
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from External_API import ExtApis_historical
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

def test_historical_data(long_root, short_root):
    db.add_long_historical_data(long_root)
    db.add_short_historical_data(short_root)
    print(db.get_historical_data())

def test_get_user():
    print(db.get_user('j11@gmail.com'))

def test_notifications():
    db.create_notification(31, 'flood warning', 'some text')
    print(db.get_notifications(31))

def test_get_alerts():
    print(db.get_alerts())

def test_update_alerts_real():
    db.update_alerts_real()
    print(db.get_alerts())

def test_update_alerts_fake_random():
    db.update_alerts_fake_random()
    print(db.get_alerts())

def test_update_alerts_fake_specific_no_coordinates():
    db.update_alerts_fake_specific("this is a specifc alert", "Brisbane, Kangaroo Point", "Run for your life", "very certain", "2024-09-27T01:37:00", "2024-09-27T02:37:00", (0,0))
    print(db.get_alerts())

def test_update_alerts_fake_specific_with_coordinates():
    db.update_alerts_fake_specific("this is a specifc alert", "Brisbane, Kangaroo Point", "Run for your life", "very certain", "2024-09-27T11:30:00", "2024-09-27T12:05:00", (100,100))
    print(db.get_alerts())

def test_delete_all_alerts():
    db.delete_all_alerts()
    print(db.get_alerts())

def test_delete_expired_alerts():
    db.delete_expired_alerts()
    print(db.get_alerts())




# test_create_user()
# test_relationships()
# test_select()
# test_create_hazard()
# test_get_hazard()
# test_historical_data()
# test_get_user()




