{{{
    "title"    : "Mongodb quick start guide",
    "tags"     : [ "Mongodb" ],
    "category" : "Mongodb",
    "date"     : "7-21-2013"
}}}

Author: [Elad Elrom](https://twitter.com/EladElrom)

## Mongodb installation

To install Mongodb for mac you will need to download and insteall Mac Ports:
[https://distfiles.macports.org/MacPorts](https://distfiles.macports.org/MacPorts)

On Macport page, pick the correct package, for me it was 10.8;
`MacPorts-2.1.3-10.8-MountainLion.pkg`

<br>
### install Mongodb:

Now you can install Mongodb:

`````
sudo port install mongodb
`````
Once install you will get the following message:

<pre>
###########################################################
# A startup item has been generated that will aid in
# starting mongodb with launchd. It is disabled
# by default. Execute the following command to start it,
# and to cause it to launch at startup:
#
# sudo port load mongodb
###########################################################
</pre>

Run the command;
<br>
`````
sudo port load mongodb
`````
<br>
<br>
### Add directories:

Next step is to add directories to keep log files;
<br>
<pre>
sudo mkdir /data/db/
sudo mkdir /var/log/mongodb
sudo chmod 777 mongodb
sudo chmod 777 db
</pre>
<br>
<br>
### Start / Stop

We are now ready to start/stop the Mongodb database;

To start Mongodb and log into a logfile:
<br>
`````
mongod -v --logpath /var/log/mongodb/server1.log --logappend
`````
<br>
To stop Mongodb:
<br>
`````
$ mongo
use admin
db.shutdownServer()
`````
<br>
See starting and stopping document on mongodb site: [http://dochub.mongodb.org/core/startingandstoppingmong](http://dochub.mongodb.org/core/startingandstoppingmongo)

<br>
### Issues with Mongodb:

In case there are issues with the database you can use the repair option;
<br>
`````
sudo mongod --repair
`````
<br>
<br>
### Command line

After start the database you can use command line:

`````
mongo
`````

See [http://docs.mongodb.org/manual/tutorial/getting-started/](http://docs.mongodb.org/manual/tutorial/getting-started/)

<br>
### Users and passwords

mongodb set username password, see:
See [http://learnmongo.com/posts/quick-tip-mongodb-users/](http://learnmongo.com/posts/quick-tip-mongodb-users/)

<br>
### Web Interface:

Mongodb web interface is available here:

[http://localhost:28017/](http://localhost:28017/)

<br>
### insert data

To set a document, add schema and insert a model;
<br>
`````
var mongoose = require('mongoose');
var db = mongoose.createConnection('localhost', 'test');

var schema = mongoose.Schema({ name: 'string' });
var Cat = db.model('Cat', schema);

var kitty = new Cat({ name: 'Zildjian' });
kitty.save(function (err) {
  if (err) // ...
  console.log('meow');
});
`````
<br>