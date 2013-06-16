// this is taken from: examples/configuredSetup.js
// only difference is how server created and roomsjs
var express = require( 'express' ),
    app     = express(),
    os      = require('os'),
    http    = require('http'),
    server = http.createServer(app),
    port    = (process.env.PORT || 8081);
    poet     = require( '../lib/poet' )( app );

poet.set({
    postsPerPage : 3,
    posts        : './_posts',
    metaFormat   : 'json'
}).createPostRoute( '/_posts/:post', 'post' )
    .createPageRoute( '/pagination/:page', 'page' )
    .createTagRoute( '/_tags/:tag', 'tag' )
    .createCategoryRoute( '/_categories/:category', 'category' )
    .init();

app.set( 'view engine', 'jade' );
app.set( 'views', __dirname + '/views' );
app.use( express.static( __dirname + '/public' ));
app.use( app.router );

app.get( '/', function ( req, res ) { res.render( 'index' ) });

var rooms = require('roomsjs');
rooms.listenToRoomEvents(server,true,null,null);

server.listen(port, function() {
    console.log('Listening on http://'+os.hostname()+':' + port );
});