# Backen Docs
contains a core server (api server) and then broken up into 3 parts all the API Routes and Features /API 
then all code for accsessing and managing data in data the databse under /Database and lastly all
the code for accsessing and interfacing with the external apis under External_API

Connect to EC2 instance using ssh
	1. Acquire the ssh key file
	2. Move to a good location (ssh config)
	3. Use the command
		
		(see marco)
	   
	Note: The argument following -i must be the path to the keypair (maybe different syntax on Mac).
	Also note: This user has root access. Be careful. For production environment, deploy on separate user without root access.

GitHub usage on EC2 instance:
	The repo ~/floodhelp/backend is currently linked with the GitHub repo (https://github.com/SixLeopard/DECO3801).
	Take note that if you are using the virtual machine to develop, the other users can also see changes made.
	To create a separate user and avoid this, run:
	
		sudo useradd username
		sudo su username
		cd ~

	Then you can clone the git repository and not affect other devs.

Why not the built in Flask webserver?
	https://flask.palletsprojects.com/en/3.0.x/deploying/

	First thing it says on the docs is to not use it in production.
	
	For our purposes (at least at the start), it is fine to use. But using a webserver (like nginx) offers several benefits:
		- Caching. Serves static content (e.g. images) without passing it off the app (floodhelp)
		- Compression
		- Allows using encryption like TSL/SSL (i.e. allows HTTPS requests, I think flask only can accept HTTP)
		- Can direct traffic to specific servers (load balancing)

	Gunicorn acts as an interface between the webserver and the application (see the section on gunicorn for more info) 


Configure NGINX
	https://nginx.org/en/docs/beginners_guide.html
	https://docs.nginx.com/nginx/admin-guide/web-server/web-server/

	To change config file open /etc/nginx/nginx.conf
	
	DO NOT CHANGE THIS UNLESS YOU KNOW WHAT YOU ARE DOING!


Configure gunicorn
	https://docs.gunicorn.org/en/latest/deploy.html#nginx-configuration

	gunicorn is a Web Server Gateway Interface, an interface between Nginx and the python app. This allows modularity by
	being able to switch either the web server, or application, without any additional configuration. Additionally, gunicorn
	creates multiple workers (child processes) to service multiple requests in parallel. The idea is that when one worker is
	blocked (e.g. for I/O ops), the other worker(s) can still operate (I think).	

	gunicorn is launched from the command line. Run command from the ~/floodhelp directory:

		sudo gunicorn --workers=2 --bind 127.0.0.1:5000 floodhelp:app

	This runs the app (the varialbe 'app' in floodhelp.py) with 2 workers, listening port 5000, and accepting connections from the local machine 
	(i.e. the instance of nginx running on the local host).

	From the guincorn docs: "Generally we recommend (2 x $num_cores) + 1 as the number of workers to start off with". 
	This VM has only one core (see file at /proc/cpuinfo). We will use only 2 workers, as the overhead of switching the
	active process/worker may exceed the benefit. There is much more we can do in terms of parallelism, especially to optimise
	performance. See https://docs.gunicorn.org/en/latest/design.html#how-many-workers).


Amazon RDS:
	Amazon RDS is a (fully managed?) database hosting platform. 
	The database we are running is Postgres, an open source relational database.
	
        (see Marco for details)
		Master username: 
		Master password: 
		Endpoint (DNS): 
		Port: 
		Instance ID:

	To connect to the database on EC2, run the following command (note: all on one line):
	
		(see Marco)
	
	And enter the password listed above after 'Master password'.

	Alternatively you can use the DBInterface class in db_interface.py to access the database. To use this first import
	the class, instantiate it, call the method connect(), then use the method query() to execute database queries.


Database schema definition:

	CREATE TABLE Users (
		uid SERIAL PRIMARY KEY,
		name VARCHAR(100) NOT NULL,
		email VARCHAR(100) NOT NULL,
		verified boolean DEFAULT False,	-- Ensure user verifies by email
		password_hash CHAR(32) NOT NULL,
		password_salt CHAR(10) NOT NULL
	);

	CREATE TABLE Relationships (
		relationship_id SERIAL PRIMARY KEY,
		uid_1 INTEGER,
		uid_2 INTEGER,
		approved Boolean DEFAULT False,	-- Requestee must approve request before other user can see location
		requester SMALLINT,	-- Either 1 or 2, to indicate which user sent the request
		UNIQUE (uid_1, uid_2)	-- Avoid duplicate relationships
	);

	ALTER TABLE Relationships ADD CONSTRAINT fk_Relationships_uid1 FOREIGN KEY (uid_1) REFERENCES Users(uid);
	ALTER TABLE Relationships ADD CONSTRAINT fk_Relationships_uid2 FOREIGN KEY (uid_2) REFERENCES Users(uid);
	
	CREATE Table User_Settings (
		uid INTEGER PRIMARY KEY,
		warnings_enabled BOOLEAN DEFAULT True,
		family_notif_enabled BOOLEAN DEFAULT True
		-- Add more here
	);

from here


	ALTER TABLE User_Settings ADD CONSTRAINT fk_user_settings_uid FOREIGN KEY (uid) REFERENCES Users(uid);
	
	CREATE TABLE Notifications (
		uid INTEGER,
		notification_id INTEGER,
		type VARCHAR(20),
		ref_warning INTEGER,
		ref_relation_req INTEGER,
		-- Add more refs for each type of notification

		PRIMARY KEY (uid, notification_id)
	);

	ALTER TABLE Notifications ADD CONSTRAINT fk_notifications_uid FOREIGN KEY (uid) REFERENCES Users(uid);
	ALTER TABLE Notifications ADD CONSTRAINT fk_notifications_warning_id FOREIGN KEY (ref_warning) REFERENCES Warnings(warning_id);
	ALTER TABLE Notifications ADD CONSTRAINT fk_notifications_relationship_id FOREIGN KEY (ref_relation_req) REFERENCES Relationships(relationship_id);

	CREATE Table Area (
		area_id SERIAL PRIMARY KEY,
		name VARCHAR(30) NOT NULL UNIQUE,
		hazard_zone BOOLEAN DEFAULT False
	);
	
	CREATE TABLE Hazards (
		hazard_id SERIAL PRIMARY KEY,
		title VARCHAR(50) NOT NULL,
		image BYTEA NOT NULL,
		datetime TIMESTAMP NOT NULL,
		reporting_user INTEGER,
		area_id INTEGER NOT NULL,
		coordinates POINT NOT NULL
	);
	
	ALTER TABLE Hazards ADD CONSTRAINT fk_hazards_reporting_user FOREIGN KEY (reporting_user) REFERENCES Users(uid);
	ALTER TABLE Hazards ADD CONSTRAINT fk_hazards_area FOREIGN KEY (area_id) REFERENCES Area(area_id);
	
	CREATE TABLE Warnings (
		warning_id SERIAL PRIMARY KEY,
		area INTEGER NOT NULL,
		description VARCHAR(255) NOT NULL,
		datetime TIMESTAMP NOT NULL
	);
	
	ALTER TABLE Warnings ADD CONSTRAINT fk_warnings_area FOREIGN KEY (area) REFERENCES Area(area_id);
		
		
	

