# Instagram User Media Feed

Instagram User Media Feed API using [Deno](https://deno.land) TypeScript Runtime.

Application has **Web Server** and **Import** executables.

## Usage - Web Server

Setup **.env** file.

```
Http:port = 8000

Instagram:appId = 'INSTAGRAM_API'
Instagram:appSecret = 'INSTAGRAM_SECRET'
Instagram:redirectUri = "INSTAGRAM_REDIRECT_URI"

Mysql:hostname = 'MYSQL_HOSTNAME'
Mysql:username = 'MYSQL_USERNAME'
Mysql:db = 'MYSQL_DATABASE'
Mysql:port = 3306
Mysql:password = 'MYSQL_PASSWORD'
```

Create Database using [DDL Script](database_schema.sql).

## Web Server Routes

- `/api/ig/sync`: Route redirecting to Instagram API authorization window with defined scopes `user_profile,user_media`.
  After allowing permission access user is redirected to your defined Redirect URI.
- `/api/ig/auth`: Redirect URI route, which takes `code` and exchanged with **Access Token** and then with **Long-Lived
  Access Token**. After exchange is redirected to `api/ig/user/{IGUserId}` route.
- `/api/ig/user/{userId}`: Route which returns JSON formatted user media from Mysql Database. URL Query argument `force=true` can be used to force download from Instagram API.
- `/api/ig/user/{userId}/profile`: Route which returns basic user information. 

## Execution Arguments

- `--allow-net: string` : Mandatory value `graph.instagram.com,api.instagram.com` for allowing server to make Instagram
  Graph and Api Requests + **your Mysql Database IP Address and your Web IP address** you want this web server to run
  on.
- `--allow-read: string`: Mandatory value **.env** allowing server to read environment file with credentials

### Example Execution

`deno run --allow-net=graph.instagram.com,api.instagram.com,127.0.0.1:3600,0.0.0.0:8000 --allow-read=.env src/http/server.ts`

## Usage - Import

If you want to periodically synchronize User Media feed database. You can execute following command via cron manager.

Import also takes care of renewing Access Token which will eventually expire in 60 days.

## Execution Arguments

- `--allow-net: string` : Mandatory value `graph.instagram.com,api.instagram.com` for allowing server to make Instagram
  Graph and Api Requests + **your Mysql Database IP Address.
- `--allow-read: string`: Mandatory value **.env** allowing server to read environment file with credentials

### Example Execution

`deno run --allow-net=graph.instagram.com,api.instagram.com,127.0.0.1:3600 --allow-read=.env src/import/import.ts`
