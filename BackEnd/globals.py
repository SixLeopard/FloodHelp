#file to defin global variables for the backend

# Import flask + autodoc
from flask import Flask
from autodoc import Autodoc

def init():
    '''
        intialises the flask app
        and auto dock and make them
        accsessible globally
    '''
    global app
    global auto
    app = Flask(__name__)
    auto = Autodoc(app) 