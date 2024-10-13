# Back End Docs
contains a core server (api server) and then broken up into 3 parts all the API Routes and Features /API 
then all code for accsessing and managing data in data the databse under /Database and lastly all
the code for accsessing and interfacing with the external apis under External_API

## Setup
getting setup to run, test and develop the backend. This is intended to be run on linux, modifcations to some of the setup will need to be modified if you want to run it on windows.

### Setting up Postgres Database
setup a postgres database, either self hosting or using a service like amazon rds
for our usage we have used amazon rds with the following configuration
```
Master username: postgres
		Master password: **************
		Endpoint (DNS): floodhelp-db.cde628megpl1.ap-southeast-2.rds.amazonaws.com
		Port: 5432
		Instance ID: floodhelp-db
```
once you have your postgres database setup, connect to it, Example:
``` bash
psql --host=floodhelp-db.cde628megpl1.ap-southeast-2.rds.amazonaws.com --port=5432 --username=postgres --password --dbname=floodhelp

#And enter the password listed above after 'Master password'.
```
run the following SQL commands to setup the database schema and tables
```SQL
CREATE TABLE Users (
		uid SERIAL PRIMARY KEY,
		name VARCHAR(100) NOT NULL,
		email VARCHAR(100) NOT NULL UNIQUE,
		verified boolean DEFAULT False,	-- Ensure user verifies by email
		password_hash BYTEA NOT NULL,
		password_salt BYTEA NOT NULL
	);

ALTER TABLE Users ADD CONSTRAINT unique_users_email UNIQUE (email);

CREATE TABLE Relationships (
  relationship_id SERIAL PRIMARY KEY,
  requester INTEGER,
  requestee INTEGER,
  approved Boolean DEFAULT False,	-- Requestee must approve request before other user can see location
  UNIQUE (uid_1, uid_2)	-- Avoid duplicate relationships
);

ALTER TABLE Relationships ADD CONSTRAINT fk_Relationships_uid1 FOREIGN KEY (uid_1) REFERENCES Users(uid) ON DELETE CASCADE;
ALTER TABLE Relationships ADD CONSTRAINT fk_Relationships_uid2 FOREIGN KEY (uid_2) REFERENCES Users(uid) ON DELETE CASCADE;

CREATE Table User_Settings (
  uid INTEGER PRIMARY KEY,
  warnings_enabled BOOLEAN DEFAULT True,
  family_notif_enabled BOOLEAN DEFAULT True
  -- Add more here
);

ALTER TABLE User_Settings ADD CONSTRAINT fk_user_settings_uid FOREIGN KEY (uid) REFERENCES Users(uid) ON DELETE CASCADE;

CREATE TYPE notification_type AS ENUM ('relationship_req', 'weather_warning', 'relationship_accepted');	

CREATE TABLE Notifications (
  uid INTEGER,
  notification_id SERIAL,
  datetime timestamp DEFAULT NOW,
  type VARCHAR(100),
  content VARCHAR(255),
  PRIMARY KEY (uid, notification_id)
);

ALTER TABLE Notifications ADD CONSTRAINT fk_notifications_uid FOREIGN KEY (uid) REFERENCES Users(uid) ON DELETE CASCADE;

CREATE Table Area (
  name VARCHAR(50) PRIMARY KEY,
  hazard_zone BOOLEAN DEFAULT False
);

CREATE TABLE Hazards (
  hazard_id SERIAL PRIMARY KEY,
  title VARCHAR(50) NOT NULL,
  description VARCHAR(255),
  image BYTEA NOT NULL,
  datetime TIMESTAMP DEFAULT NOW,
  reporting_user INTEGER,
  area VARCHAR(50),
  coordinates POINT NOT NULL
);

ALTER TABLE Hazards ADD CONSTRAINT fk_hazards_reporting_user FOREIGN KEY (reporting_user) REFERENCES Users(uid);
ALTER TABLE Hazards ADD CONSTRAINT fk_hazards_area FOREIGN KEY (area) REFERENCES Area(name) ON DELETE SET NULL;

CREATE TABLE Warnings (
  warning_id SERIAL PRIMARY KEY,
  area VARCHAR(30),
  description VARCHAR(255) NOT NULL,
  datetime TIMESTAMP DEFAULT NOW
);

ALTER TABLE Warnings ADD CONSTRAINT fk_warnings_area FOREIGN KEY (area) REFERENCES Area(name) ON DELETE SET NULL;

CREATE TABLE Alerts (
  id SERIAL PRIMARY KEY,
  headline VARCHAR(256),
  location VARCHAR(50),
  risk VARCHAR(50),
  certainty VARCHAR(50),
  start_ts VARCHAR(50),
  end_ts VARCHAR(50),
  coordinates VARCHAR(50)
);
  
CREATE TABLE ShortHistorical (
  id SERIAL PRIMARY KEY,
  risk VARCHAR(50),
  coordinates TEXT,
  type VARCHAR(50)
);

CREATE TABLE LongHistorical (
  id SERIAL PRIMARY KEY,
  risk VARCHAR(50),
  coordinates TEXT,
  type VARCHAR(50)
);

CREATE OR REPLACE FUNCTION init_user_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_settings (uid) VALUES (NEW.uid);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER init_user_settings
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION init_user_settings();



CREATE OR REPLACE FUNCTION user_report_expiry()
RETURNS VOID AS $$
BEGIN
  DELETE FROM Hazards
  WHERE timestamp - NOW() > timestamp '0000-00-02 00:00:00';
END;
```

## Setting Up Gunicorn and Nginx
install Gunicorn
```
pip install gunicorn
```
install nginx and set the config to:
```
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log notice;
pid /run/nginx.pid;

# Load dynamic modules. See /usr/share/doc/nginx/README.dynamic.
include /usr/share/nginx/modules/*.conf;

events {
    worker_connections 1024;
}

http {
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile            on;
    tcp_nopush          on;
    keepalive_timeout   65;
    types_hash_max_size 4096;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    include /etc/nginx/conf.d/*.conf;

    server {
        listen 5000;
	      #listen       5000 ssl http2;
        #listen       [::]:443 ssl http2;

        server_name  ec2-54-206-190-121.ap-southeast-2.compute.amazonaws.com;

        #ssl_certificate "/etc/pki/nginx/server.crt";
        #ssl_certificate_key "/etc/pki/nginx/private/server.key";
        #ssl_session_cache shared:SSL:1m;
        #ssl_session_timeout  10080m; #one week
        #ssl_ciphers PROFILE=SYSTEM;
        #ssl_prefer_server_ciphers on;

	access_log  /var/log/nginx/example.log;

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

	#
	location / {
        	proxy_pass http://127.0.0.1:8000;
        	proxy_set_header Host $host;
        	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    	}
    }
}
```
this has ssl displayed by default due to the requiment of an ssl certificate,
you can enable ssl by uncommenting the ssl_ lines, filling in correct ssl cert and key locations, and then uncommenting the two commented listen lines, then commenting the listen line "listen 5000;"

## Seting up python enviroment
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

## updating database credentials
Enter the database credntials from the database setup setup steps into line 49 under the connection function in /BackEnd/Database/db_interface.py. Our demo databse credentials are included in the script however this won't be still be live after the second half of 2025 due there being cost incurred after 1 year of running the database on aws 
```python
def connect(self):
	self.conn = psycopg2.connect(
		dbname="{DB_NAME}", \
		user="{USER}", \
		password="{PASSWORD}", 
		host="{HOST}", \
		port="{HOST}")

	self.cur = self.conn.cursor()
```
## Running API Server
getting the api server running and accepting API calls
```bash
sudo systemctl restart nginx
nohup gunicorn -b 0.0.0.0 'server:app' &
```
navigate to http{s}://{public_ip}:5000 to see the intro API response

## Using API
all routes and there methods can be found by navigating to http{s}://{public_ip}:5000/documentation. this information is also available under /BackeEnd/API/ReadMe.md
