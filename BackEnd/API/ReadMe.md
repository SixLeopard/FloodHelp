API Documentation
=============
## Table of Contents

- [GET /](#get-)
- [POST /accounts/create](#post-accountscreate)
- [GET /accounts/get_current](#get-accountsget_current)
- [POST /accounts/login](#post-accountslogin)
- [GET /accounts/test](#get-accountstest)
- [GET /check_in/get_checkins](#get-check_inget_checkins)
- [GET /check_in/get_my_status](#get-check_inget_my_status)
- [POST /check_in/send](#post-check_insend)
- [POST /check_in/send_push](#post-check_insend_push)
- [GET /documentation](#get-documentation)
- [POST /externalData/clear_alerts](#post-externaldataclear_alerts)
- [POST /externalData/clear_expired_alerts](#post-externaldataclear_expired_alerts)
- [GET /externalData/get_alerts](#get-externaldataget_alerts)
- [GET /externalData/get_historical_data](#get-externaldataget_historical_data)
- [POST /externalData/get_polygon](#post-externaldataget_polygon)
- [GET /externalData/get_river_conditions](#get-externaldataget_river_conditions)
- [POST /externalData/update_fake_random_alerts](#post-externaldataupdate_fake_random_alerts)
- [POST /externalData/update_fake_specific_alerts](#post-externaldataupdate_fake_specific_alerts)
- [POST /externalData/update_real_alerts](#post-externaldataupdate_real_alerts)
- [POST /locations/update](#post-locationsupdate)
- [POST /notifications/add](#post-notificationsadd)
- [GET /notifications/get](#get-notificationsget)
- [POST /relationships/approve/](#post-relationshipsapprove)
- [POST /relationships/create](#post-relationshipscreate)
- [POST /relationships/delete/](#post-relationshipsdelete)
- [GET /relationships/get_relationships](#get-relationshipsget_relationships)
- [POST /reporting/user/add_report](#post-reportinguseradd_report)
- [GET /reporting/user/get_all_report_basic](#get-reportinguserget_all_report_basic)
- [GET /reporting/user/get_all_report_details](#get-reportinguserget_all_report_details)
- [GET /reporting/user/get_all_reports_by_user](#get-reportinguserget_all_reports_by_user)
- [POST /reporting/user/get_report](#post-reportinguserget_report)
- [POST /reporting/user/get_report_validation_score](#post-reportinguserget_report_validation_score)
- [GET /session/get](#get-sessionget)
- [POST /session/set](#post-sessionset)
- [GET /sync](#get-sync)
- [GET /test](#get-test)

/
-

[*   GET](/)

  
      Returning welcome page through api  
    

/accounts/create
----------------

*   POST

  
        Form Data:  
            name -> Users Fullname  
            email -> User Email  
            password -> User Password  
          
        Return:  
            Json containing if the creation was  
            completed by created : True or   
            created: False if it was unsuccsesful  
            in additon if th eaccount creation  
            was completed then also returns  
            the username and encrypted password  
    

/accounts/get\_current
----------------------

[*   GET](/accounts/get_current)

  
        Form Data:  
            None  
          
        Return:  
            Json containing the information  
            of the current user logged in  
    

/accounts/login
---------------

*   POST

  
        Route for user Logins  
  
        Form Data:  
            email -> User Email  
            password -> User Password  
          
        Return:  
            Json containing if the login was completed  
            denoted by login: True oor Login: False if it failed  
            in additon if the login was succsessful  
            the sessionid  
    

/accounts/test
--------------

[*   GET](/accounts/test)

  
        route to test if accounts route is working  
  
        Form Data:  
            takes nothing  
          
        Return:  
            time stamp + some other test output  
          
    

/check\_in/get\_checkins
------------------------

[*   GET](/check_in/get_checkins)

  
        get all status for users that the requester has a relationship with  
  
        Form Data:  
            Nothing  
          
        Return:  
            all checkins for the user and there status  
            either "Completed" , "Pending", "Unknown" or "Unsafe"  
    

/check\_in/get\_my\_status
--------------------------

[*   GET](/check_in/get_my_status)

  
        get your current status  
  
        Form Data:  
            Nothing  
          
        Return:  
            yourcurrent checkin status  
            either "Completed" , "Pending", "Unknown" or "Unsafe"  
    

/check\_in/send
---------------

*   POST

  
        updates the current users status  
  
        Form Data:  
            status -> what you want your status to be  
          
        Return:  
            {"added checkin to":receiver, "from":session\["username"\]}  
    

/check\_in/send\_push
---------------------

*   POST

  
        respond to all pending checkins against you  
  
        Form Data:  
            reciever -> the uid of the user you want to send the checkin push to   
          
        Return:  
            {"added piush notfication to":{reciever uid}, "from":{current user uid}}  
    

/documentation
--------------

[*   GET](/documentation)

  
        Displays documentation page  
  
        Documentation is genertated for each of the routes  
        regested to the flask server, then gathers them  
        all and obtains there methods "get" or "post"  
        this is then used in combintation with the doc  
        strings on the route to generate the documenation automaticaly   
    

/externalData/clear\_alerts
---------------------------

*   POST

  
        Clears all alerts in the database  
          
        Form Data:  
            None  
  
        Return:  
            if succsessful: None  
            no login: {"invalid\_account":1}  
            not using GET: {"invalid\_request":1}  
    

/externalData/clear\_expired\_alerts
------------------------------------

*   POST

  
        Clears all expired alerts in the database  
          
        Form Data:  
            None  
  
        Return:  
            if succsessful: None  
            no login: {"invalid\_account":1}  
            not using GET: {"invalid\_request":1}  
    

/externalData/get\_alerts
-------------------------

[*   GET](/externalData/get_alerts)

  
        Retrieves all flood alerts in the database  
          
        Form Data:  
            None  
  
        Return:  
            if succsessful: list of tuples, which are the alert. Looks like: \[('headline', 'location', 'risk', 'certainty', 'start', 'end', 'coordinates'), ...\]   
            no login: {"invalid\_account":1}  
            not using GET: {"invalid\_request":1}  
    

/externalData/get\_historical\_data
-----------------------------------

[*   GET](/externalData/get_historical_data)

  
        Gives historical data  
          
        Form Data:  
            None  
  
        Return:  
            if succsessful: list of tuples: \[(risk, coordinates, type),\]  
            no login: {"invalid\_account":1}  
            not using GET: {"invalid\_request":1}  
    

/externalData/get\_polygon
--------------------------

*   POST

  
        Gets the corresponding polygon that a coordinate is in.  
          
        Form Data:  
            Coordinate (example: (153.016861, -27.499547))  
  
        Return:  
            if succsessful: Returns the database row (tuple) where the point is contained within the polygon or multipolygon.   
            Returns \`None\` if the point is not found within any polygon or multipolygon.  
            no login: {"invalid\_account":1}  
            not using GET: {"invalid\_request":1}  
    

/externalData/get\_river\_conditions
------------------------------------

[*   GET](/externalData/get_river_conditions)

  
        Gives flood conditions for over 40 river height stations around Brisbane.  
          
        Form Data:  
            None  
  
        Return:  
            if succsessful: json of flood risks for river height stations. Keys are: 'location\_name', 'Coordinates', 'Last Updated', and 'Flood Category'.  
            no login: {"invalid\_account":1}  
            not using GET: {"invalid\_request":1}  
    

/externalData/update\_fake\_random\_alerts
------------------------------------------

*   POST

  
        Updates the database with 1-3 random fake alerts  
        Don't call too many times in a short period of time (3-5 min)  
  
        Form Data:  
            None  
  
        Return:  
            if succsessful: None  
            no login: {"invalid\_account":1}  
            not using GET: {"invalid\_request":1}  
    

/externalData/update\_fake\_specific\_alerts
--------------------------------------------

*   POST

  
        Add one custom fake alert to database  
        Don't call too many times in a short period of time (3-5 min)  
  
        If you want to specify exact coordinates of alert, put in the coordinates that you want in "coordinates" argument. If you want to just provide a location  
        without specifying exact coordinates, input (0,0) into the "coordinates" argument.  
          
        Form Data:  
            'headline': general headline  
            'location': area in which alert is in  
            'risk': risk level of alert  
            'certainty': certainty of alert  
            'start': issue date of alert  
            'end': expiry date of alert  
            'coordinates': exact coordinates of alert, in the form of a tuple  
  
        Return:  
            if succsessful: None  
            no login: {"invalid\_account":1}  
            not using GET: {"invalid\_request":1}  
    

/externalData/update\_real\_alerts
----------------------------------

*   POST

  
        Updates the database with real alerts  
        Don't call too many times in a short period of time (3-5 min)  
  
        Form Data:  
            None  
  
        Return:  
            if succsessful: None  
            no login: {"invalid\_account":1}  
            not using GET: {"invalid\_request":1}  
    

/locations/update
-----------------

*   POST

  
        Update user's current location in the in memory dictionaries of each  
        of the users who are allowed to track them. Additionally, get locations  
        of each of the users who the user is allowed to track. If no location is   
        currently known for a user, the mapping is set to None.  
  
        Form Data:  
            location -> users current location  
  
        Return:  
            A JSON string of the locations of each of the users who the user  
            who made the request can track. If no location known, the value of  
            the location is None.  
    

/notifications/add
------------------

*   POST

  
        submit new pending notification  
  
        Form Data:  
            notification -> the notification string to send  
            receiver -> the uid of who you want to send notification too  
  
        Return:  
            if succsessful: {notifcation added: " + str(notification) + "}  
            no login: {"invalid\_account":1}  
            not using POST: {"invalid\_request":1}  
    

/notifications/get
------------------

[*   GET](/notifications/get)

  
        get all pending notification  
  
        Form Data:  
            None  
  
        Return:  
            if succsessful: {current pending notifications: " + str(users\_pending\_notifications) + "}"  
            in which users\_pending\_notifications is json of all the user notification  
            no login: {"invalid\_account":1}  
            not using POST: {"invalid\_request":1}  
    

/relationships/approve/
-----------------------

*   POST

  
        Approve a relationship (if exists) between the user who is currently  
        logged in, and the user specified in the other\_user field of the request.  
        If no relationship exists, return error.  
  
        Form Data:  
            relationship\_id -> the id of the relationship to approve  
  
        Return:  
            if succsessful: {"relationship\_approved": 1}  
            error1: {"no\_relationship": 1}  
            error2: {"missing\_relationship\_id": 1}  
            error3: {"internal\_error": data}  
            no login: {"invalid\_account":1}  
            not using POST: {"invalid\_request":1}  
    

/relationships/create
---------------------

*   POST

  
        Create a relationship between two users. The user who creates the  
        relationship is stored in the 'requester' field, and the other user  
        in the 'requestee' field. A relationship is set to not approved by   
        default.   
  
        Form Data:  
                requestee\_email -> the email of user you want to request a relationship with  
  
        Return:  
            if succsessful: "success": 1}  
            error1: {"user\_does\_not\_exist": 1}  
            error2: {"relationship\_exists": 1}  
            error3: {"self\_relationship": 1}  
            error4: {"database error": e.pgerror}  
            no login: {"invalid\_account":1}  
            not using POST: {"invalid\_request":1}  
    

/relationships/delete/
----------------------

*   POST

  
    Delete a relationship specified by the relationship id  
  
    Form Data:  
        relationship\_id -> the id of the relationship to delete  
      
    Returns:  
        if succsessful: {"relationship\_deleted": 1}  
        error1: {"no\_relationship": 1}  
        error2: {"missing\_relationship\_id": 1}  
        error3: {"internal\_error": data}  
        error4: {"failed": 1}  
        no login: {"invalid\_account":1}  
        not using POST: {"invalid\_request":1}  
    

/relationships/get\_relationships
---------------------------------

[*   GET](/relationships/get_relationships)

  
        Get all relationships of the user who is currently logged in  
  
        Form Data:  
            None  
  
        Return:  
            if succsessful: Json of all relationships (see format beloew)  
            no login: {"invalid\_account":1}  
            not using POST: {"invalid\_request":1}  
          
        Relationships format:  
            {relationship\_id: {requester\_name, requester\_uid, requestee\_name, requestee\_uid, approved}, ...}  
    

/reporting/user/add\_report
---------------------------

*   POST

  
        Submit new user report  
  
        Form Data:  
            location -> the location of the user in the form "{LAT},{LONG}"  
            hazard\_type -> The type or name of the hazard  
            description -> textual description of the hazard  
            image -> An image assosciated with the hazard  
            title -> title of the hazard  
  
        Returns:  
            if successful: {hazard\_id, hazard\_type, datetime, reporting\_uid, area\_name, coordinates, img, title}  
            error 1: {'internal\_error': error\_description}  
            no login: {"invalid\_account":1}  
            not using POST: {"invalid\_request":1}  
    

/reporting/user/get\_all\_report\_basic
---------------------------------------

[*   GET](/reporting/user/get_all_report_basic)

  
    Retrieve all reports made by all users but only include some details.  
    Details included are:  
        - hazard\_id  
        - datetime  
        - type  
        - coordinates  
        - title  
  
    Form data:  
        None  
  
    Returns:  
        if successful: {hazard\_id, hazard\_type, datetime, coordinates, title}  
        error 1: {'internal\_error': error\_description}  
        no login: {"invalid\_account":1}  
        not using POST: {"invalid\_request":1}  
    

/reporting/user/get\_all\_report\_details
-----------------------------------------

[*   GET](/reporting/user/get_all_report_details)

  
    Retrieve all reports made by all users including all details  
  
    Form data:  
        None  
  
    Returns:  
        if successful: {hazard\_id: {hazard\_type, datetime, reporting\_uid, area\_name, coordinates, img, title}, ...}  
        error 1: {'internal\_error': error\_description}  
        no login: {"invalid\_account":1}  
        not using POST: {"invalid\_request":1}  
    

/reporting/user/get\_all\_reports\_by\_user
-------------------------------------------

[*   GET](/reporting/user/get_all_reports_by_user)

  
    Retrieve all reports made by the current user including all detials.  
    Returns a nested JSON string where the key is the report ID of each report  
    and the value is the details of the report  
  
    Form data:  
        None  
  
    Returns:  
        if successful: {hazard\_id: {hazard\_type, datetime, reporting\_uid, area\_name, coordinates, img, title}, ...}  
        error 1: {'internal\_error': error\_description}  
        no login: {"invalid\_account":1}  
        not using POST: {"invalid\_request":1}  
    

/reporting/user/get\_report
---------------------------

*   POST

  
    Retrieve the report with the ID specified in the report\_id field of the request body  
  
    Form Data:  
        report\_id: The numerical ID of the report to retrieve  
  
    Returns:  
        if successful: {hazard\_id: {hazard\_type, datetime, reporting\_uid, area\_name, coordinates, img, title}, ...}  
        error 1: {'internal\_error': error\_description}  
        no login: {"invalid\_account":1}  
        not using POST: {"invalid\_request":1}  
    

/reporting/user/get\_report\_validation\_score
----------------------------------------------

*   POST

  
        get validation score for specific report  
  
        Form Data:  
            report\_id: the report id to get the validation score for  
  
        Returns:  
            {report\_id:score} where score gives the score number then a list of  
            of all the hazrd ids that contributeed to that score, and also a list of all nearby official alerts  
    

/session/get
------------

[*   GET](/session/get)

  
        get the current session id  
  
        Form Data:  
            None  
  
        Return:  
            {"response":f"the id is {session.get('id')}  
    

/session/set
------------

*   POST

  
        set the current session id  
  
        takes session\_id arg as the session id to set it to  
  
        Form Data:  
            None  
  
        Return:  
            {"response":"id session key is set"}  
    

/sync
-----

[*   GET](/sync)

  
        get updates notfications locations etc...  
        everyhting that needs to be regularly synced   
        for user  
  
        Form Data:  
            None  
  
        Return:  
            Combiend Json of all the information needed for an update  
    

/test
-----

[*   GET](/test)

None
