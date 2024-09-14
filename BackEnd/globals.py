#file to defin global variables for the backend

# Import flask + autodoc
from flask import Flask
from autodoc import Autodoc

global app
global auto

def init():
    '''
        intialises the flask app
        and auto dock and make them
        accsessible globally
    '''
    app = Flask(__name__)
    auto = Autodoc(app) 