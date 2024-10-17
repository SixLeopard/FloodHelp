###############################################
# Description
###############################################
# Route for API that contains all the account
# related routes and supporting functions
###############################################
# Setup
###############################################

def convert(coord : str) -> tuple[float,float]:
    '''
        simple function to convert cordiant formated strings
        like (4324.324,32423.32) into a tuple of floats
    '''
    parts = coord.replace('"', "").replace(')', "").replace('(', "").replace('[', "").replace(']', "").split(",")
    output = (float(parts[0].replace("{", "").replace("}", "")), float(parts[1].replace("{", "").replace("}", "")))
    return output
