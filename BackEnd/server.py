###
# test server that returns a json with
# a rabdom number calculated at time of request
# aswell as the timestemp for when that number was generated
# way to interact with mobile app
###

# Import flask
from flask import Flask
import random as rand
import datetime
 
# Initializing flask app
app = Flask(__name__)
 
# Route for seeing a data
@app.route('/data')
def get_data():
    # Returning data through api
    value = calcualte_test_values()
    time_stamp = datetime.datetime.now()
    return {
        'Requested':"data", 
        "Time_stamp":time_stamp, 
        "Value":value
    }

def calcualte_test_values():
    return rand.randint(0,9)

     
# Running app
if __name__ == '__main__':
    app.run(debug=True)