var
    express  = require( 'express' ),
    app      = express(),
    http = require('http'),
    server = http.createServer(app),
    poet     = require( './lib/poet' )( app),
    os = require('os'),
    port = (process.env.PORT || 8081);

server.listen(port, function() {
    console.log('Listening on http://'+os.hostname()+':' + port );
});

poet.set({
  postsPerPage : 3,
  posts        : './_posts',
  metaFormat   : 'json'
}).createPostRoute( '/_posts/:post', 'post' )
  .createPageRoute( '/pagination/:page', 'page' )
  .createTagRoute( '/mytags/:tag', 'tag' )
  .createCategoryRoute( '/mycategories/:category', 'category' )
  .init();

var rooms = require('rooms');
rooms.listenToRoomEvents(server,true,null);

// pretty code
app.configure('development', function(){
    app.use(express.errorHandler());
    app.locals.pretty = true;
});

app.set( 'view engine', 'jade' );
app.set( 'views', __dirname + '/views' );
app.use( express.static( __dirname + '/public' ));
app.use( app.router );

app.get( '/', function ( req, res ) { res.render( 'index' ) });