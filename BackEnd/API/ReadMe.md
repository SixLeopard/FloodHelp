# API Docs
documention on how to use API

Postman:
[link to join poastman team](https://app.getpostman.com/join-team?invite_code=24f47a95d83fc9d6c70758cacc3ca8e7)

once in the postman team switch to the Flood Help workspace <br>
within the workspace is a collection for each set of api calls that can be made to the server

## Login
set of api routes that are for accounts and logins

### Create:
#### path:
{{base_url}}/account/create

#### Data:
Username = username_string <br>
password = pasword_string <br>

#### Returns:
##### if succsessful:
{<br>
  "created":"True",<br>
  "username":f"{username}",<br>
  "passkey":f"{sessionkey}"<br>
}<br>
##### if unsuccsessful:
{<br>
  "created":"False"<br>
}<br>

## Session
