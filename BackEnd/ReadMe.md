# Back End Docs
contains a core server (api server) and then broken up into 3 parts all the API Routes and Features /API 
then all code for accsessing and managing data in data the databse under /Database and lastly all
the code for accsessing and interfacing with the external apis under External_API

## Getting Setup
getting setup to run, test and develop the backend

### Seting up python enviroment
```bash
#from the project root
cd ./BackEnd
pip install virtualenv
python3 -m venv .venv
```
### Activating Python Enviroment
```bash
#macos or linux
source .venv/bin/activate

#windows
.\.venv\Scripts\activate

```
### Install Dependencies
```bash
pip install -r ./requirements.txt
```

## Running API Server
getting the api server running and accepting API calls
```bash
python .\server.py
```
navigate to http://127.0.0.1:5000 to see the intro API response
