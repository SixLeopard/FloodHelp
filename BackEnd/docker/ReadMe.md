# Docker API setup

## First create the network for the containers to communicate on
```bash
docker network create -d bridge flood-net
```
## Build and Run Database
```bash
#build the postgress docker container
docker build -f docker/DB_Dockerfile.txt -t flood-help-db .
#intilise the container
docker run --network flood-net -p 5432:5432 --name flood-help-db flood-help-db
#start the container
docker start flood-help-db
#load example database from dump
docker exec -d flood-help-db pg_restore -v -h localhost -U postgres -d floodhelp -j 2 /docker-entrypoint-initdb.d/db_dump.sql
```

## update Backend/Database/db_interface with correct credentials
on line 49 replace the connect function with this:
```python
def connect(self):
        self.conn = psycopg2.connect(
                dbname="floodhelp", \
                user="postgres", \
                password="docker", \
                host="flood-help-db", \
                port="5432")

        self.cur = self.conn.cursor()
```

## Build and Run API 
```bash
#build the docker container
docker build -f docker/API_Dockerfile.txt -t flood-help-api .
#run the api server on
docker run --network flood-net -p 5000:5000 --name flood-help-api -d flood-help-api
```

## User the API
can now connect on `http://{ip}:5000` or if running locally should be able to accses from browser at `http://{localhost}:5000`

## Connecting it with app
refer to font end documention to see how to change api endpoint the app is using the adress rhe docker containers are running on