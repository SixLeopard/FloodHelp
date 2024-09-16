#file to defin global variables for the backend

# Import flask + autodoc
from flask import Flask
from autodoc import Autodoc

app = Flask(__name__)
auto = Autodoc(app) 