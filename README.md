# GreenBot Express API Server

This API is responsible to storing and using data that is provided and retrieved by GreenBot. Authentication with Discord is required for any administrative functions but needs to be worked on further.

## Installation

###### Run an install of all packages.

```bash
$ npm Install
```

###### Create .env in the root directory with the format.
```
key=value
```

###### For the following keys:

   * DB_HOST => Available at mongodb. login credentials required for using database.
   * DB_TEST_HOST => required only for testing purposes.
   * CLIENT_ID => Available through discord developer portal. Required for API Authentication
   * CLIENT_SECRET => Also available through discord developer portal.

###### Before deploying bot to Discord, manually insert Discord ID into administrators database. This can be done through the mongodb website or within the mongo console (without the chevrons).

```ruby
$ use mern
$ db.authusers.insert({ user_id: <Administrator ID>, username: <Administrator Username>})
console.log()
```
