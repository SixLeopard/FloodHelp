# API Docs

documention of all the routes and there data inputs and request type

<!-- TOC start (generated with https://github.com/derlin/bitdowntoc) -->

- [API Docs](#api-docs)
   * [/](#)
   * [/accounts/create](#accountscreate)
   * [/accounts/login](#accountslogin)
   * [/accounts/test](#accountstest)
   * [/documentation](#documentation)
   * [/externalData/get\_polygon](#externaldataget_polygon)
   * [/externalData/get\_historical\_data](#externaldataget_historical_data)
   * [/externalData/get\_river\_conditions](#externaldataget_river_conditions)
   * [/externalData/get\_alerts](#externaldataget_alerts)
   * [/externalData/clear\_alerts](#externaldataclear_alerts)
   * [/externalData/clear\_expired\_alerts](#externaldataclear_expired_alerts)
   * [/externalData/update\_fake\_specific\_alerts](#externaldataupdate_fake_specific_alerts)
   * [/externalData/update\_fake\_random\_alerts](#externaldataupdate_fake_random_alerts)
   * [/externalData/update\_real\_alerts](#externaldataupdate_real_alerts)
   * [/notifications/add](#notificationsadd)
   * [/notifications/get](#notificationsget)
   * [/relationships/approve/](#relationshipsapprove)
   * [/relationships/create](#relationshipscreate)
   * [/relationships/get\_approved](#relationshipsget_approved)
   * [/relationships/get\_not\_approved](#relationshipsget_not_approved)
   * [/reporting/user/add\_report](#reportinguseradd_report)
   * [/reporting/user/get\_all\_report\_basic](#reportinguserget_all_report_basic)
   * [/reporting/user/get\_all\_report\_details](#reportinguserget_all_report_details)
   * [/reporting/user/get\_all\_reports\_by\_user](#reportinguserget_all_reports_by_user)
   * [/reporting/user/get\_report](#reportinguserget_report)
   * [/reporting/user/get\_report\_validation\_score](#reportinguserget_report_validation_score)
   * [/session/get](#sessionget)
   * [/session/set](#sessionset)
   * [/sync](#sync)
   * [/test](#test)

<!-- TOC end -->

<!-- TOC --><a name="api-docs"></a>

<!-- TOC --><a name=""></a>
## /
-

[*   GET](/)

  
      Returning welcome page through api  
    

<!-- TOC --><a name="accountscreate"></a>
## /accounts/create
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
    

<!-- TOC --><a name="accountslogin"></a>
## /accounts/login
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
    

<!-- TOC --><a name="accountstest"></a>
## /accounts/test
--------------

[*   GET](/accounts/test)

  
        route to test if accounts route is working  
  
        Form Data:  
            takes nothing  
          
        Return:  
            time stamp + some other test output  
          
    

<!-- TOC --><a name="documentation"></a>
## /documentation
--------------

[*   GET](/documentation)

  
        Displays documentation page  
  
        Documentation is genertated for each of the routes  
        regested to the flask server, then gathers them  
        all and obtains there methods "get" or "post"  
        this is then used in combintation with the doc  
        strings on the route to generate the documenation automaticaly   
    

<!-- TOC --><a name="externaldataget_river_conditions"></a>
## /externalData/get\_river_conditions
-----------------------------

[*   GET](/externalData/get_river_conditions)

  
        Gives flood conditions for over 40 river height stations around Brisbane. 
          
        Form Data:  
            None 
  
        Return:  
            if succsessful: json of flood risks for river height stations. Keys are: 'location_name', 'Coordinates', 'Last Updated', and 'Flood Category'.  
            no login: {"invalid\_account":1}  
            not using GET: {"invalid\_request":1}  
    

<!-- TOC --><a name="notificationsadd"></a>
## /notifications/add
------------------

*   POST

  
        submit new pending notification  
  
        Form Data:  
            notification -> the notification string to send  
            receiver -> who you want to send notification too  
  
        Return:  
            if succsessful: {notifcation added: " + str(notification) + "}  
            no login: {"invalid\_account":1}  
            not using POST: {"invalid\_request":1}  
    

<!-- TOC --><a name="notificationsget"></a>
## /notifications/get
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
    

<!-- TOC --><a name="relationshipsapprove"></a>
## /relationships/approve/
-----------------------

*   POST

  
        Approve a relationship (if exists) between the user who is currently  
        logged in, and the user specified in the other\_user field of the request.  
        If no relationship exists, return error.  
  
        Form Data:  
            other\_user -> the uid of the user who's relationship request you want to approve  
  
        Return:  
            if succsessful: {"relationship\_approved": 1}  
            error1: {"no\_relationship": 1}  
            error2: {"missing\_uid": 1}  
            no login: {"invalid\_account":1}  
            not using POST: {"invalid\_request":1}  
    

<!-- TOC --><a name="relationshipscreate"></a>
## /relationships/create
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
            error1: {"Error": "Requested user does not exist"}  
            error2: {"Error": "Relationship exists"}  
            error3: {"Database error": e.pgerror}  
            no login: {"invalid\_account":1}  
            not using POST: {"invalid\_request":1}  
    

<!-- TOC --><a name="relationshipsget_approved"></a>
## /relationships/get\_approved
----------------------------

[*   GET](/relationships/get_approved)

  
        Get all approved relationships of the user who is currently logged in  
          
        Form Data:  
            None  
  
        Return:  
            if succsessful: json of all approved relationships  
            no login: {"invalid\_account":1}  
            not using POST: {"invalid\_request":1}  
    

<!-- TOC --><a name="relationshipsget_not_approved"></a>
## /relationships/get\_not\_approved
---------------------------------

[*   GET](/relationships/get_not_approved)

  
        Get all NOT approved relationships of the user who is currently logged in  
  
        Form Data:  
            None  
  
        Return:  
            if succsessful: Json of all non-approved relationships  
            no login: {"invalid\_account":1}  
            not using POST: {"invalid\_request":1}  
    

<!-- TOC --><a name="reportinguseradd_report"></a>
## /reporting/user/add\_report
---------------------------

*   POST

  
        Submit new user report  
  
        Form Data:  
            location -> the location of the user in the form "{LAT},{LONG}"  
            hazard\_type -> The type or name of the hazard  
            description -> textual description of the hazard  
            image -> An image assosciated with the hazard  
  
        Returns:  
            if successful: {hazard\_id, hazard\_type, datetime, reporting\_uid, area\_name, coordinates, img}  
            error 1: {'internal\_error': error\_description}  
            no login: {"invalid\_account":1}  
            not using POST: {"invalid\_request":1}  
    

<!-- TOC --><a name="reportinguserget_all_report_basic"></a>
## /reporting/user/get\_all\_report\_basic
---------------------------------------

[*   GET](/reporting/user/get_all_report_basic)

  
    Retrieve all reports made by all users but only include some details.  
    Details included are:  
        - hazard\_id  
        - datetime  
        - title  
        - coordinates  
  
    Form data:  
        None  
  
    Returns:  
        if successful: {hazard\_id, hazard\_type, datetime, coordinates}  
        error 1: {'internal\_error': error\_description}  
        no login: {"invalid\_account":1}  
        not using POST: {"invalid\_request":1}  
    

<!-- TOC --><a name="reportinguserget_all_report_details"></a>
## /reporting/user/get\_all\_report\_details
-----------------------------------------

[*   GET](/reporting/user/get_all_report_details)

  
    Retrieve all reports made by all users including all details  
  
    Form data:  
        None  
  
    Returns:  
        if successful: {hazard\_id, hazard\_type, datetime, reporting\_uid, area\_name, coordinates, img}  
        error 1: {'internal\_error': error\_description}  
        no login: {"invalid\_account":1}  
        not using POST: {"invalid\_request":1}  
    

<!-- TOC --><a name="reportinguserget_all_reports_by_user"></a>
## /reporting/user/get\_all\_reports\_by\_user
-------------------------------------------

[*   GET](/reporting/user/get_all_reports_by_user)

  
    Retrieve all reports made by the current user including all detials.  
    Returns a nested JSON string where the key is the report ID of each report  
    and the value is the details of the report  
  
    Form data:  
        None  
  
    Returns:  
        if successful: {hazard\_id: {hazard\_type, datetime, reporting\_uid, area\_name, coordinates, img}, ...}  
        error 1: {'internal\_error': error\_description}  
        no login: {"invalid\_account":1}  
        not using POST: {"invalid\_request":1}  
    

<!-- TOC --><a name="reportinguserget_report"></a>
## /reporting/user/get\_report
---------------------------

*   POST

  
    Retrieve the report with the ID specified in the report\_id field of the request body  
  
    Form Data:  
        report\_id: The numerical ID of the report to retrieve  
  
    Returns:  
        if successful: {hazard\_id, hazard\_type, datetime, reporting\_uid, area\_name, coordinates, img}  
        error 1: {'internal\_error': error\_description}  
        no login: {"invalid\_account":1}  
        not using POST: {"invalid\_request":1}  
    

<!-- TOC --><a name="reportinguserget_report_validation_score"></a>
## /reporting/user/get\_report\_validation\_score
----------------------------------------------

*   POST

  
        get validation score for specific report  
  
        Form Data:  
            report\_id: the report id to get the validation score for  
  
        Returns:  
            {report\_id:score} where score gives the score number then a list of  
            of all the hazrd ids that contributeed to that score, , and also a list of all nearby official alerts  
    

<!-- TOC --><a name="sessionget"></a>
## /session/get
------------

[*   GET](/session/get)

  
        get the current session id  
  
        Form Data:  
            None  
  
        Return:  
            {"response":f"the id is {session.get('id')}  
    

<!-- TOC --><a name="sessionset"></a>
## /session/set
------------

*   POST

  
        set the current session id  
  
        takes session\_id arg as the session id to set it to  
  
        Form Data:  
            None  
  
        Return:  
            {"response":"id session key is set"}  
    

<!-- TOC --><a name="sync"></a>
## /sync

[*   GET](/sync)

  
        get updates notfications locations etc...  
        everyhting that needs to be regularly synced   
        for user  
  
        Form Data:  
            None  
  
        Return:  
            Combiend Json of all the information needed for an update  
    


<!-- TOC --><a name="externalDataget_polygon"></a>
## /externalData/get\_polygon
---------------------------------

[*   GET](/externalData/get\_polygon)

  
        Gets the corresponding polygon that a coordinate is in (from the historical data).
        
        Form Data:
            Coordinate (example: (153.016861, -27.499547))

        Return:
            if succsessful: Returns the database row (tuple) where the point is contained within the polygon or multipolygon. 
            Returns `None` if the point is not found within any polygon or multipolygon.
            no login: {"invalid_account":1}
            not using GET: {"invalid_request":1}



<!-- TOC --><a name="externalDataget_alerts"></a>
## /externalData/get\_alerts
---------------------------------

[*   GET](/externalData/get\_alerts)

  
        Retrieves all flood alerts in the database
        
        Form Data:
            None

        Return:
            if succsessful: list of tuples, which are the alert. Looks like: [('headline', 'location', 'risk', 'certainty', 'start', 'end', 'coordinates'), ...] 
            no login: {"invalid_account":1}
            not using GET: {"invalid_request":1}


<!-- TOC --><a name="externalDataupdate_real_alerts"></a>
## /externalData/update\_real\_alerts
---------------------------

*   POST

  
        Updates the database with real alerts
        Don't call too many times in a short period of time (3-5 min)

        Form Data:
            None

        Return:
            if succsessful: None
            no login: {"invalid_account":1}
            not using GET: {"invalid_request":1} 


<!-- TOC --><a name="externalDataupdate_fake_random_alerts"></a>
## /externalData/update\_fake\_random\_alerts
---------------------------

*   POST

  
        Updates the database with 1-3 random fake alerts
        Don't call too many times in a short period of time (3-5 min)

        Form Data:
            None

        Return:
            if succsessful: None
            no login: {"invalid_account":1}
            not using GET: {"invalid_request":1} 

<!-- TOC --><a name="externalDataupdate_fake_specific_alerts"></a>
## /externalData/update\_fake\_specific\_alerts
---------------------------

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
            no login: {"invalid_account":1}
            not using GET: {"invalid_request":1}


<!-- TOC --><a name="externalDataclear_alerts"></a>
## /externalData/clear\_alerts
---------------------------

*   POST

  
        Clears all alerts in the database
        
        Form Data:
            None

        Return:
            if succsessful: None
            no login: {"invalid_account":1}
            not using GET: {"invalid_request":1}


<!-- TOC --><a name="externalDataclear_expired_alerts"></a>
## /externalData/clear\_expired\_alerts
---------------------------

*   POST

  
        Clears all expired alerts in the database
        
        Form Data:
            None

        Return:
            if succsessful: None
            no login: {"invalid_account":1}
            not using GET: {"invalid_request":1}

<!-- TOC --><a name="externalDataget_historical_data"></a>
## /externalData/get\_historical\_data
---------------------------------

[*   GET](/externalData/get\_historical\_data)

  
        Gives historical data
        
        Form Data:
            None

        Return:
            if succsessful: list of tuples: [(risk, coordinates, type), ...]
            no login: {"invalid_account":1}
            not using GET: {"invalid_request":1}




<!-- TOC --><a name="test"></a>
## /test
-----

[*   GET](/test)

None

